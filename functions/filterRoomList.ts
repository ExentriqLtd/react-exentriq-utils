/** @format */

import memoize from "fast-memoize";
import { TRoom } from "../declarations/rooms";

export const utilityFilterRoomList = memoize((rooms: TRoom[]) => {
  const roomsFiltered = rooms.filter((room) => {
    const isRoomOpened = room.open;
    return isRoomOpened;
  });

  return roomsFiltered;
});
