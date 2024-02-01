import "./Board.css";
import { useAppContext } from "../../contexts/Context";

import Ranks from "./bits/Ranks";
import Files from "./bits/Files";
import Pieces from "../Pieces/Pieces";
import PromotionBox from "../Popup/PromotionBox/PromotionBox";
import Popup from "../Popup/Popup";
import GameEnds from "../Popup/GameEnds/GameEnds";

import arbiter from "../../arbiter/arbiter";
import { getKingPosition } from "../../arbiter/getMoves";

const Board = () => {
  //מערכי שורות ועמודות
  const ranks = Array(8)
    .fill()
    .map((x, i) => 8 - i);
  const files = Array(8)
    .fill()
    .map((x, i) => i + 1);

  // שימוש ב-Context לקבלת מצב המשחק הנוכחי
  const { appState } = useAppContext();
  const position = appState.position[appState.position.length - 1];

  // בדיקה אם המלך נמצא בשח
  const checkTile = (() => {
    const isInCheck = arbiter.isPlayerInCheck({
      positionAfterMove: position, //מצב נוכחי של הלוח
      player: appState.turn, //שחקן שעכשיו משחק
    });
    //קבל את מיקום המלך כאשר הוא בשח
    if (isInCheck) return getKingPosition(position, appState.turn);

    return null;
  })();

  //שמות לריבועים צבעים להתקפות
  const getClassName = (i, j) => {
    let c = "tile";
    //צבעים
    c += (i + j) % 2 === 0 ? " tile--dark " : " tile--light ";
    //בדיקה עם הריבוע הוא חלק מהמהלכים
    if (appState.candidateMoves?.find((m) => m[0] === i && m[1] === j)) {
      //אם יש כלי הוא יכול להיות מותקף
      if (position[i][j]) c += " attacking";
      else c += " highlight";
    }

    if (checkTile && checkTile[0] === i && checkTile[1] === j) {
      c += " checked";
    }

    return c;
  };

  return (
    <div className="board">
      <Ranks ranks={ranks} />

      <div className="tiles">
        {ranks.map((rank, i) =>
          files.map((file, j) => (
            <div
              key={file + "" + rank}
              i={i} // שורה שבה נמצאת התיבה
              j={j} // עמודה שבה נמצאת התיבה
              className={`${getClassName(7 - i, j)}`}
            ></div>
          ))
        )}
      </div>

      <Pieces />

      <Popup>
        <PromotionBox />
        <GameEnds />
      </Popup>

      <Files files={files} />
    </div>
  );
};

export default Board;
