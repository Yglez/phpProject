    var dehFeeList = dehFee.dehFees;

    var FoodBlock2 = document.getElementById("FFoodoptsBlock");
    var FoodBlock3 = document.getElementById("FoptsBlock3");
    var FoodBlock4 = document.getElementById("FoptsBlock4");
    var FoodBlock5 = document.getElementById("FoptsBlock5");

    var businessTypeOpt = document.getElementById("hmdBusinessTypeQ");
    var wasteOpt = document.getElementById("hmdWasteQ");
    var inventoryOpt = document.getElementById("hmdInventoryQ");
    var abovegroundOpt = document.getElementById("hmdAbovegroundQ");
    var undergroundOpt = document.getElementById("hmdUndergroundTankQ");
    var estimateTotal = document.getElementById("estimateTotal");

    //var hmdWasteBlock = document.getElementById("hmdWasteBlock");
    //var hmdInventoryBlock = document.getElementById("hmdInventoryBlock");
    //var hmdAbovegroundBlock = document.getElementById("hmdAbovegroundBlock");
    //var hmdUndergroundTankBlock = document.getElementById("hmdUndergroundTankBlock");


  // Hide other Divisions' block
  function ClearDivisionsH(){
     FoodBlock2.innerHTML = "";
     FoodBlock3.innerHTML = "";
     FoodBlock4.innerHTML = "";
     FoodBlock5.innerHTML = "";
  }

  // Hide hmd's block
  function clearHmdBlocks(){
    $("#hmdUndergroundTankBlock").hide();
    $("#hmdWasteBlock").hide();
    $("#hmdInventoryBlock").hide();
    $("#hmdAbovegroundBlock").hide();
    $("#estimateTotal").hide();
  }

  // Reset drop downs
  function resetOpts(){
    wasteOpt.value = 0;
    inventoryOpt.value = 0;
    abovegroundOpt.selectedIndex = 0;
    undergroundOpt.value = 0;
  }

  // Check missing select options and highlight
  function checkMissingOpts(){
    if (abovegroundOpt.selectedIndex === 0){
      $("#hmdAbovegroundQ").addClass("req");
    }else{
      $("#hmdAbovegroundQ").removeClass("req");
    }
  }

  // Show hmd questions based on business type selected
  function getHmdBlocks(){
    clearHmdBlocks();
    resetOpts();
    var businessTypeIndex = businessTypeOpt.selectedIndex;
    var businessTypeValue = businessTypeOpt[businessTypeIndex].value;
    switch(businessTypeValue){
      case "0":
        ClearHmdBlocks();
        break;
      case "medLess200":
        $("#hmdUndergroundTankBlock").show();
        break;
      case "medOver200":
        $("#hmdUndergroundTankBlock").show();
        $("#hmdWasteBlock").show();
        $("#hmdInventoryBlock").show();
        $("#hmdAbovegroundBlock").show();
        break;
      case "other":
        $("#hmdUndergroundTankBlock").show();
        $("#hmdWasteBlock").show();
        $("#hmdInventoryBlock").show();
        $("#hmdAbovegroundBlock").show();
        break;
      default:
        ClearHmdBlocks();
        console.log("There was an error in getHmdBlocks function");
    }
  }

  function hideTotalBlock(){
   $("#estimateTotal").hide(); 
  }

  // Get selected Index from all HMD options
  function getHmdEstimateTotal(){
    var abovegroundValue = abovegroundOpt.selectedIndex;
    abovegroundValue = abovegroundOpt[abovegroundValue].value;
    var getFees = "";
    var busTypes = getBusTypeCodes();
      getTotal = busTypes[0] + busTypes[1] + busTypes[2] + busTypes[3] + busTypes[4];
      getFees += '<div class="detailsBlock">';
      getFees += '<h5>Details</h5>';
      getFees += '<table class="table table-responsive table-hover"><thead><tr><th>Selected</th><th>Fee</th></tr></thead><tbody>';
      getFees += '<tr><td>Business Type: </td><td>' + busTypes[0] + '</td></tr>';
      getFees += '<tr><td>Waste: </td><td>' + busTypes[1] + '</td></tr>';
      getFees += '<tr><td>Inventory: </td><td>' + busTypes[2] + '</td></tr>';
      getFees += '<tr><td>Aboveground: </td><td>' + busTypes[3] + '</td></tr>';
      getFees += '<tr><td>Underground: </td><td>' + busTypes[4] + '</td></tr>';
      getFees += '</tbody><tfoot><th id="" colspan="1">Fee Total</th><td id="" class="" id="">' + getTotal + '</td></tfoot></table>';
      getFees += '</div>';
      $("#estimateTotal").show();
      estimateTotal.innerHTML = 'Estimated Total: ' + getTotal + '<button type="button" class="btn btn-outline-info btn-sm floatRight" data-toggle="collapse" data-target="#viewDetails">View Details <span class="fa fa-angle-down faSideArrow faSide"></span></button><br /><div id="viewDetails" class="collapse">' + getFees + '</div>';
  }

  // Loop through selected busines type to get the fees it is subject to
  function getBusTypeCodes(){
    var feeCodeBusType = 0;
    var feeCodeWaste = 0;
    var feeCodeUnderground = 0;
    var feeCodeInventory = 0;
    var feeCodeAboveground = 0;
    var inventoryAmt = 0;
    var businessTypeIndex = businessTypeOpt.selectedIndex;
    var businessTypeValue = businessTypeOpt[businessTypeIndex].value;
    var abovegroundValue = abovegroundOpt.selectedIndex;
    abovegroundValue = abovegroundOpt[abovegroundValue].value;
    if (undergroundOpt.value > 0){
      feeCodeUnderground = parseFloat(getFee("6HUST--EHO")) + parseFloat(getFee("6HCUPA2EHO")) * undergroundOpt.value;
    }
    if (inventoryOpt.value < 41){
      inventoryAmt = parseFloat(getFee("6HMAT---EH")) * inventoryOpt.value;
    }else{
      inventoryAmt = 3120;
    }
    switch(businessTypeValue){
      case "0":
        feeCodeBusType = 0;
        break;
      case "medLess200":
        feeCodeBusType = parseFloat(getFee("6HMED--EHO"));
        break;
      case "medOver200":
        feeCodeBusType = parseFloat(getFee("6HBASE-EHO")) + parseFloat(getFee("6HCUPA1EHO")) + parseFloat(getFee("6HLQMED--O"));
        feeCodeWaste = parseFloat(getFee("6HWASTE-EH")) * wasteOpt.value;
        feeCodeInventory = inventoryAmt;
        feeCodeAboveground = getAbovegroundFee(abovegroundValue);
        break;
      case "other":
        feeCodeBusType = parseFloat(getFee("6HBASE-EHO")) + parseFloat(getFee("6HCUPA1EHO"));
        feeCodeWaste = parseFloat(getFee("6HWASTE-EH")) * wasteOpt.value;
        feeCodeInventory = inventoryAmt;
        feeCodeAboveground = getAbovegroundFee(abovegroundValue);
        break;
      default:
        console.log("There was an error in getHmdBlocks function");
    }
        return [feeCodeBusType, feeCodeWaste, feeCodeInventory, feeCodeAboveground, feeCodeUnderground];
  }

  // Find fee amount based on fee code passed 
  function getFee(code){
    for (i = 0; i < dehFeeList.length; i++){
      if (dehFee.dehFees[i].feeCode === code){
        return dehFee.dehFees[i].feeAmount;
      }
    }
  }

  // Get above ground fee
  function getAbovegroundFee(aboveOpt){
    var abovegroundFee = 0;
    switch(aboveOpt){
      case "null":
        abovegroundFee = 0;
        break;
      case "0":
        abovegroundFee = 0;
        break;
      case "below1320":
        abovegroundFee = 0;
        break;
      case "btwn1320":
        abovegroundFee = parseFloat(getFee("6HCUPA8EHO")) + parseFloat(getFee("6HAPSA---1"));
        break;
      case "btwn10k":
        abovegroundFee = parseFloat(getFee("6HCUPA8EHO")) + parseFloat(getFee("6HAPSA---2"));
        break;
      case "btwn100k":
        abovegroundFee = parseFloat(getFee("6HCUPA8EHO")) + parseFloat(getFee("6HAPSA---3"));
        break;
      case "btwn1m":
        abovegroundFee = parseFloat(getFee("6HCUPA8EHO")) + parseFloat(getFee("6HAPSA---4"));
        break;
      case "btwn10m":
        abovegroundFee = parseFloat(getFee("6HCUPA8EHO")) + parseFloat(getFee("6HAPSA---5"));
        break;
      default:
        console.log("error in getAbovegroundFee function");
    }
    return abovegroundFee;
  }