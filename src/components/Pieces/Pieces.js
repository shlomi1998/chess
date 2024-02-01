import "./Pieces.css";
import Piece from "./Piece";
import { useRef, useEffect, useState } from "react";
import { useAppContext } from "../../contexts/Context";
import { openPromotion } from "../../reducer/actions/popup";
import { getCastlingDirections } from "../../arbiter/getMoves";
import {
  updateCastling,
  detectStalemate,
  detectInsufficientMaterial,
  detectCheckmate,
} from "../../reducer/actions/game";
import actionTypes from "../../reducer/actionTypes";
import { makeNewMove, clearCandidates } from "../../reducer/actions/move";
import arbiter from "../../arbiter/arbiter";

const Pieces = () => {
  const { appState, dispatch } = useAppContext();
  const currentPosition = appState.position[appState.position.length - 1];

  useEffect(() => {
    // המרת כל מערך למחרוזת
    const positionsAsStrings = appState.position.map((pos) =>
      pos.flat().join(",")
    );

    // בדיקה לכל מערך אם הוא מופיע שלוש פעמים
    positionsAsStrings.forEach((posStr, index) => {
      const occurrences = positionsAsStrings.filter((p) => p === posStr).length;
      if (occurrences === 3) {
        // console.log("Draw at index", index);
        // alert(`Draw detected at index ${index}`);
        dispatch({ type: actionTypes.INSUFFICIENT_MATERIAL });
      }
    });
  }, [appState.position]);

//   const [pawnPositions, setPawnPositions] = useState([]);
//   const [movesWithoutPawnMovement, setMovesWithoutPawnMovement] = useState(0);

//   const findPawns = (position) => {
//       return position.flatMap((row, rank) =>
//           row.map((piece, file) => (piece === 'wp' || piece === 'bp') ? { piece, rank, file } : null)
//       ).filter(p => p);
//   };

//   useEffect(() => {
//       const currentPawns = findPawns(currentPosition);

//       let pawnsMoved = false;
//       if (pawnPositions.length > 0) {
//           pawnsMoved = currentPawns.some(pawn => {
//               const previousPawn = pawnPositions.find(p => p.piece === pawn.piece && p.file === pawn.file);
//               return previousPawn && previousPawn.rank !== pawn.rank;
//           });
//       }

//       if (pawnsMoved) {
//           setMovesWithoutPawnMovement(0);
//       } else {
//           setMovesWithoutPawnMovement(prev => prev + 1);
//       }

//       setPawnPositions(currentPawns);

//       if (movesWithoutPawnMovement >= 5) {
//           dispatch({ type: actionTypes.INSUFFICIENT_MATERIAL });
//       }
//   }, [appState.position]);

//   useEffect(() => {
//       let moveWithoutChangeInPieces = 0;
//       let previousPieceCount = countPieces(appState.position[0]);

//       appState.position.forEach((currentPosition, index) => {
//           if (index === 0) return; // דילוג על הבדיקה במצב הראשוני

//           const currentPieceCount = countPieces(currentPosition);

//           if (currentPieceCount === previousPieceCount) {
//               moveWithoutChangeInPieces++;
//           } else {
//               moveWithoutChangeInPieces = 0; // איפוס הספירה אם הכמות כלים השתנתה
//               previousPieceCount = currentPieceCount;
//           }

//           if (moveWithoutChangeInPieces >= 5) {
//               dispatch({ type: actionTypes.INSUFFICIENT_MATERIAL }); // תיקו לאחר 50 מסעים ללא שינוי בכמות הכלים
//           }
//       });
//   }, [appState.position]);

//   function countPieces(position) {
//       return position.flat().filter(p => p).length; // ספירת הכלים על הלוח
//   }

  const ref = useRef();

  //בדיקת הצרחה
  const updateCastlingState = ({ piece, file, rank }) => {
    const direction = getCastlingDirections({
      castleDirection: appState.castleDirection,
      piece,
      file,
      rank,
    });
    if (direction) {
      dispatch(updateCastling(direction));
    }
  };

  //הפונקציה לערכי השידרוג חייל
  const openPromotionBox = ({ rank, file, x, y }) => {
    dispatch(
      openPromotion({
        rank: Number(rank),
        file: Number(file),
        x,
        y,
      })
    );
  };

  //חישוב לפי מיקום העכבר ביחס ללוח
  const calculateCoords = (e) => {
    const { top, left, width } = ref.current.getBoundingClientRect();
    const size = width / 8;
    const y = Math.floor((e.clientX - left) / size);
    const x = 7 - Math.floor((e.clientY - top) / size);

    return { x, y };
  };

  const move = (e) => {
    const { x, y } = calculateCoords(e); //קאורדינטות
    const [piece, rank, file] = e.dataTransfer.getData("text").split(","); //מיקום בלוח של הריבוע

    if (appState.candidateMoves.find((m) => m[0] === x && m[1] === y)) {
      //המידע שהועבר בגרירה ושחרור (סוג היחידה, שורה, קובץ)
      const opponent = piece.startsWith("b") ? "w" : "b"; //מי היריב
      const castleDirection =
        appState.castleDirection[
          `${piece.startsWith("b") ? "white" : "black"}`
        ]; //כיוונים
      //קידום
      if ((piece === "wp" && x === 7) || (piece === "bp" && x === 0)) {
        openPromotionBox({ rank, file, x, y });
        return;
      }
      //הצרחה
      if (piece.endsWith("r") || piece.endsWith("k")) {
        updateCastlingState({ piece, file, rank });
      }
      //מהלך משחק
      const newPosition = arbiter.performMove({
        position: currentPosition,
        piece,
        rank,
        file,
        x,
        y,
      });
      //עדכון בהתאם למהלך
      dispatch(makeNewMove({ newPosition }));

      //בדיקת המהלך אם תיקו
      if (arbiter.insufficientMaterial(newPosition))
        dispatch(detectInsufficientMaterial());
      else if (arbiter.isStalemate(newPosition, opponent, castleDirection)) {
        //בדיקה אם שחמט
        dispatch(detectStalemate());
      } else if (arbiter.isCheckMate(newPosition, opponent, castleDirection)) {
        //בדיקה אם פט
        dispatch(detectCheckmate(piece[0]));
      }
    }
    dispatch(clearCandidates());
  };

  const onDrop = (e) => {
    e.preventDefault();

    move(e);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="pieces" ref={ref} onDrop={onDrop} onDragOver={onDragOver}>
      {currentPosition.map(
        (
          r,
          rank //בדיקת חייל במשבצת נוכחית
        ) =>
          r.map(
            (f, file) =>
              currentPosition[rank][file] ? (
                <Piece
                  key={rank + "-" + file}
                  rank={rank}
                  file={file}
                  piece={currentPosition[rank][file]}
                />
              ) : null //אין שחקן לא מוסיפיפ
          )
      )}
    </div>
  );
};

export default Pieces;
