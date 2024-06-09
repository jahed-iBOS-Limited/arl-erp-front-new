export const getPdfFormatNumber = (adviceType, advice) => {
  switch ([adviceType, advice].join("-")) {
    case "1-1":
    case "1-8":
    case "12-1":
    case "12-8":
    case "13-1":
    case "13-8":
    case "14-1":
    case "14-8":
    case "15-1":
    case "20-1":
    case "21-1":
      return 1;

    case "1-2":
    case "1-9":
    case "12-2":
    case "12-9":
    case "13-2":
    case "13-9":
    case "14-2":
    case "14-9":
    case "15-2":
    case "15-8":
    case "15-9":
    case "15-4":
    case "20-2":
    case "21-2":
      return 2;

    case "1-3":
    case "12-3":
    case "13-3":
    case "14-3":
    case "15-3":
      return 3;
    // for jamuna beftn and nrbc beftn format 4 same
    case "1-4":
    case "12-4":
    case "13-4":
    case "14-4":
    case "1-10":
    case "12-10":
    case "13-10":
    case "14-10":
    case "21-4":
      return 4;

    case "5-1":
    case "5-2":
    case "5-3":
    case "5-4":
    case "5-8":
    case "5-9":
      return 5;

    case "1-7":
    case "12-7":
    case "13-7":
    case "14-7":
      return 6;

    case "1-5":
    case "12-5":
    case "13-5":
    case "14-5":
    case "1-6":
    case "12-6":
    case "13-6":
    case "14-6":
      return 7;

    default:
      break;
  }
};
