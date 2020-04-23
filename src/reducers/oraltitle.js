import { ORALTITLE ,CLASSTITLE} from "../constants/oraltitle";

const ORAL_TITLE = {
  oraltitle: null,
  classtitle:[]
};

export default function oraltitleReducer(state = ORAL_TITLE, action) {
  switch (action.type) {
    case ORALTITLE:
      return {
        ...state,
        oraltitle: action.oraltitle
      };
      case CLASSTITLE:
      return {
        ...state,
        oraltitle: action.classtitle
      };
    default:
      return state;
  }
}
