import { useContext } from "react";
import { ShowContext } from "./ShowContextProvider";

export function useShows() {
  return useContext(ShowContext);
}
