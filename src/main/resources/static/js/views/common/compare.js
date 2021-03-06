

var highlightTransferFee = 4000;

var pre1 = 7;
var pre2 = 0;


var audio = new Audio('/short.mp3');
audio.loop = true;
audio.volume = 1.0;


var audio2 = new Audio('/long.mp3');
audio2.loop = true;
audio2.volume = 1.0;


var audio3 = new Audio('/bithumb.mp3');
audio3.loop = true;
audio3.volume = 1.0;

// 수익률 계산기 관련 function22

$(function(){
    $('#saveTradeBtn').click(function(){
    	// var resultJsonArray = new Array();
		var resultVO = new Object();
		// 업비트 출발 트레이드 정보
		resultVO.exchangeName_A = $('#trade_exchangeName_1').val();
		resultVO.coinSymbol_A = $('#trade_coinSymbol_1').val();
		resultVO.totalPrice_A = $('#trade_totalPrice_1').val();
		
		// 업비트 도착 트레이드 정보
		resultVO.exchangeName_B = $('#trade_exchangeName_4').val();
		resultVO.coinSymbol_B = $('#trade_coinSymbol_4').val();
		resultVO.totalPrice_B = $('#trade_totalPrice_4').val();
		
		// 총 수익 및 수익률 정보
		resultVO.profitPrice = $('#trade_totalPrice_5').val();
		resultVO.profitRate  = $('#trade_profitRate_5').val();
		
    	saveTradeHistory(resultVO);
    	
    });
    
    $('#setProfitBtn').click(function(){
   	 
    });
    
    $('#setTotalProfitBtn').click(function(){
    	var exchangePrice = $('#exchangePrice').val();		// BTC-KRW 가격
    	
    	// 업비트-바이낸스 코인이름, 개수 세팅
    	var trade_coinSymbol_1 = $('#trade_coinSymbol_1').val();
    	$("#trade_coinSymbol_1").val(trade_coinSymbol_1.toUpperCase());
    	$("#trade_coinSymbol_2").val(trade_coinSymbol_1.toUpperCase());
    	var trade_quantity_1 = $('#trade_quantity_1').val();
    	$("#trade_quantity_2").val(trade_quantity_1);
    	
    	
    	for(var i=1; i<5; i++){
    		var quantity = $('#trade_quantity_' + i).val();				// 입력한 사토시 가격
    		var coinPrice = 0;
    		if(i == 1){
    			coinPrice = $('#upbitPrice_' + trade_coinSymbol_1.toUpperCase()).text();				// 입력한 사토시 가격
    			$("#trade_coinPrice_1").val(coinPrice);
    		}else if(i == 2){
    			coinPrice = $('#binancePrice_' + trade_coinSymbol_1.toUpperCase()).text();				// 입력한 사토시 가격
    			$("#trade_coinPrice_2").val(coinPrice);
    		}else {
    			coinPrice = $('#trade_coinPrice_' + i).val();				// 입력한 사토시 가격
    		}
    		var totalPrice = quantity*coinPrice;
    		totalPrice = comma(totalPrice.toFixed(0));
    		$("#trade_totalPrice_" + i).val('￦ ' + totalPrice);
    	}
    	
    	
    	
    	var totalPrice_1 = uncomma($("#trade_totalPrice_1").val());
    	var totalPrice_2 = uncomma($("#trade_totalPrice_2").val());
    	var totalPrice_3 = uncomma($("#trade_totalPrice_3").val());
    	var totalPrice_4 = uncomma($("#trade_totalPrice_4").val());
    	
    	// 업비트-바낸 수익률
    	var profitRate_1 = (1-(totalPrice_1/totalPrice_2))*100;
    	profitRate_1 = profitRate_1.toFixed(2);
    	if(Number(profitRate_1) < 0){
    		$("#trade_profitRate_").removeClass("text-danger text-success");
    		$("#trade_profitRate_1").addClass("text-success");
    		$("#trade_profitRate_1").val(profitRate_1);
    	}else {
    		$("#trade_profitRate_1").removeClass("text-danger text-success");
    		$("#trade_profitRate_1").addClass("text-danger");
    		$("#trade_profitRate_1").val(profitRate_1);
    	}
    	
    	// 바낸-업비트 수익률
    	var profitRate_3 = (1-(totalPrice_2/totalPrice_4))*100;
    	profitRate_3 = profitRate_3.toFixed(2);
    	if(Number(profitRate_3) < 0){
    		$("#trade_profitRate_3").removeClass("text-danger text-success");
    		$("#trade_profitRate_3").addClass("text-success");
    		$("#trade_profitRate_3").val(profitRate_3);
    	}else {
    		$("#trade_profitRate_3").removeClass("text-danger text-success");
    		$("#trade_profitRate_3").addClass("text-danger");
    		$("#trade_profitRate_3").val(profitRate_3);
    	}
    	
    	// 최종 수익률
    	var profitRate_5 = (1-(totalPrice_1/totalPrice_4))*100;
    	profitRate_5 = profitRate_5.toFixed(2);
    	if(Number(profitRate_5) < 0){
    		$("#trade_profitRate_5").removeClass("text-danger text-success");
    		$("#trade_profitRate_5").addClass("text-success");
    		$("#trade_profitRate_5").val(profitRate_5);
    	}else {
    		$("#trade_profitRate_5").removeClass("text-danger text-success");
    		$("#trade_profitRate_5").addClass("text-danger");
    		$("#trade_profitRate_5").val(profitRate_5);
    	}
    	
    	// 최종 가격
    	var totalPrice_5 = totalPrice_4 - totalPrice_1;
    	totalPrice_5 = comma(totalPrice_5.toFixed(0));
    	$("#trade_totalPrice_5").val('￦ ' + totalPrice_5);
    });
});

function saveTradeHistory(param) {
	var data = param;
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : "/history/saveTradeHistory",
		data : JSON.stringify(data),
		dataType : 'json',
		// tradtional : true,				// json List로 받기 위한 설정
		timeout : 5000,
		success : function(data) {
			
			
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}


$(function(){
    $('#sathoshiBtn').click(function(){
    	var exchangePrice = $('#exchangePrice').val();		// BTC-KRW 가격
    	var sathoshi = $('#sathoshi').val();				// 입력한 사토시 가격
    	var result = exchangePrice*sathoshi;
    	if(context == 'admin'){
    		result = result.toFixed(2);
    	}else {
    		result = result.toFixed(2);				// 소숫점 둘째자리에서 반올림
    	}
    	$("#sathoshiPrice").val(result);
    });
    
    $('#sathoshiBtn2').click(function(){
    	var exchangePrice = $('#exchangePrice2').val();		// BTC-KRW 가격
    	var sathoshi = $('#sathoshi2').val();				// 입력한 사토시 가격
    	var result = exchangePrice*sathoshi;
    	if(context == 'admin'){
    		result = result.toFixed(2);
    	}else {
    		result = result.toFixed(2);				// 소숫점 둘째자리에서 반올림
    	}
    	$("#sathoshiPrice2").val(result);
    });
});
 

$(function(){
    $('#kimchPreminumBtn').click(function(){
    	var kimchPreminum = $('#kimchPreminum').val();		// BTC-KRW 가격
    	$("#kimchPreminumVal").val(kimchPreminum);
    });
});
	
	
// BTC-KRW 가격 저장
function setBtcKrwPrice(){
	var data = {}
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/admin/getBtcKrwPrice",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 10000,
		success : function(data) {
			var updateDt = data.btcUpdateDt;		// 업데이트 날짜
			var price = Math.round(data.binanceBtcKrwPrice);
			
			$("#exchange_rate").empty();
			$("#exchange_rate").text( comma(price) + ' 원' );
			$("#exchangePrice").val(price);
			$("#exchangePriceUpdateDt").text(updateDt);
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}
 
/*
 * 환율 가져오는 function
 */
function getExchangeRate() {
	var data = {}
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/admin/getExchangeRate",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 50000,
		success : function(data) {
			var basePrice = Math.round(data[0].basePrice);
			$("#exchange_rate2").text( '   ' + comma(basePrice) + '원' );
			$("#exchangePrice2").val( basePrice );
			$("#exchangePriceUpdateDt2").text(data[0].date + ' ' +  data[0].time );
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}

/*
 * 코인 리스트 가져오는 function
 */
function getPriceExchangeInfo() {
	var data = {}
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/admin/priceExchangeInfo",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 5000,
		success : function(data) {
			var result = data;
			var resultHtml = '<select id="coinSymbolList" data-placeholder="Choose a Country..." class="chosen-select" multiple style="width:350px;" tabindex="4">';
			$.each(result, function(){
				var symbol = this.coinSymbolName;
				resultHtml += '<option value="'+ symbol + '">'+ symbol +'</option>';
			});
			resultHtml += "</select>";
			$("#coinSymbolList").html(resultHtml);
			
			$('.chosen-select').chosen({width: "100%"});
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}

/*
 * 업비트-바이낸스 가격 가져오는 function
 */
function getCompareUSDT() {
	var data = {}
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare/USDT",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			var result = data;
			var resultJsonArray = new Array();
			var resultHtml = "";
			$("#priceTbody").html('');
			
			$.each(result, function(){
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.priceKrwA = this.priceKrwA;
				resultVO.priceKrwB = this.priceKrwB;
				resultVO.priceBtcB = this.priceBtcB;
				resultVO.priceUsdtB = this.priceUsdtB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.status = this.status;
				resultHtml += "<tr>";
				resultHtml += "<td>-</td>";
				resultHtml += "<td>" + this.coinSymbol + "</td>";
				resultHtml += "<td>" + comma(this.priceBtcB) + "</td>";
				resultHtml += "<td>" + comma(this.priceUsdtB) + "</td>";
				resultHtml += "<td>" + comma(this.priceKrwB) + "</td>";
				resultHtml += "<td>" + comma(this.priceKrwA) + "</td>";
				resultHtml += "<td>" + "-" + "</td>";
				
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + '<i class="fa fa-level-down"></i></td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td>" + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + "</td>";
				}else {
					resultHtml += '<td class="text-danger">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ')   ' + '<i class="fa fa-level-up"></i></td>';
				}
				resultHtml += "</tr>";
				// 마이너스 빨간색 플러스 파란색 
				resultJsonArray.push(resultVO);
			});
			$("#priceTbody").html(resultHtml);
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}


/*
 * 업비트-바이낸스 가격 가져오는 function
 */
function getCompareUSDT2() {
	var data = {}
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare2/USDT",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			 
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}

/*
 * 업비트-바이낸스 가격 가져오는 function
 */
function getCompareUSDT3() {
	var data = {}
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare3/USDT",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			 
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}
/*
 * 업비트-바이낸스 가격 가져오는 function
 */
function getCompareBTC() {
	var data = {}
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare/BTC",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			var result = data;
			
			// 선택한 코인 조회하기
			var choiceCoinList = $("ul.chosen-choices").find("li>span");
			var choiceCoinStr = '';
			$.each(choiceCoinList, function(){
				var value = $(this).text();
				choiceCoinStr += value + "/";
			})
			
			
			// 임시
			if(context == 'admin'){
				choiceCoinStr = "MFT/STMX/BTT/ANKR/TFUEL/NPXS/SC/";
				// choiceCoinStr = "ADA/PIVX/KMD/GRS/WAVES/ICX/NEO/ONT/QTUM/DASH/GTO/ETH/ETC/EOS/TRX/LSK/LTC/BTG/BCH/XRP/POWR/SNT/STORJ/OMG/ZRX/MCO/GNT/STORM/REP/MTL/ZIL/LOOM/";
			}
			
			var resultJsonArray = new Array();
			var resultHtml = "";
			var sendMessage = "Y";
			
			// 김치 프리미엄 
			var minPremium = Number($("#minPremium").val());
			var maxPremium = Number($("#maxPremium").val());
			
			// 텔레그램 프리미엄
			var telegram = $("#kimchPreminum").val();
			
			$("#priceTbodyBTC").html('');
			
			$.each(result, function(){
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.priceKrwA = this.priceKrwA;
				resultVO.priceKrwB = this.priceKrwB;
				resultVO.priceBtcB = this.priceBtcB;
				resultVO.priceUsdtB = this.priceUsdtB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.coinPriceWeightA = this.coinPriceWeightA;
				resultVO.coinPriceWeightB = this.coinPriceWeightB;
				resultVO.status = this.status;
				

				if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					resultHtml += "<tr class='alert-success'>";
				}else {
					resultHtml += "<tr>";
				}
				
				resultJsonArray.push(resultVO);
				// 텔레그램 메시지 전송
				if( this.priceKrwA != null && this.priceKrwB != null && (this.priceGapPercent < telegram )){
					sendMessage = "Y";
				}
				
				/*if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					// 텔레그램 메시지 전송
					if( this.priceGapPercent < telegram){
						sendMessage = "Y";
					}
					resultJsonArray.push(resultVO);
					
					resultHtml += "<tr class='alert-success'>";
				}else {
					resultHtml += "<tr>";
				}*/
				
				resultHtml += "<td>-</td>";
				resultHtml += "<td>" + this.coinSymbol + "</td>";
				resultHtml += "<td>" + this.priceBtcB + "</td>";
				
				if(this.coinPriceWeightB > maxPremium){
					resultHtml += '<td class="text-danger font-bold">' + comma(this.priceKrwB) + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-up"></i>';
				}else if(this.coinPriceWeightB < minPremium){
					resultHtml += '<td class="text-success font-bold">'  + comma(this.priceKrwB) + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down"></i>';
				}else {
					resultHtml += '<td>'  + comma(this.priceKrwB);
				}
				resultHtml += "  (" + this.coinPriceWeightB +")" + "</td>";
				
				if(this.transferFeeB <= highlightTransferFee){
					resultHtml += '<td class="text-danger">' + comma(this.transferFeeB) + "</td>";
				}else {
					resultHtml += "<td>" + comma(this.transferFeeB) + "</td>";
				}
				
				if(this.coinPriceWeightA > maxPremium){
					resultHtml += '<td class="text-danger font-bold">' + comma(this.priceKrwA) + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-up"></i>';
				}else if(this.coinPriceWeightA < minPremium){
					resultHtml += '<td class="text-success font-bold">'  + comma(this.priceKrwA) + '&nbsp;&nbsp;<i class="fa fa-thumbs-o-down"></i>';
				}else {
					resultHtml += '<td>'  + comma(this.priceKrwA);
				}
				resultHtml += "  (" + this.coinPriceWeightA +")" + "</td>";
				
				if(this.transferFeeA <= highlightTransferFee){
					resultHtml += '<td class="text-danger">' + comma(this.transferFeeA) + "</td>";
				}else {
					resultHtml += "<td>" + comma(this.transferFeeA) + "</td>";
				}
                 
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + '<i class="fa fa-level-down"></i></td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td>" + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + "</td>";
				}else {
					resultHtml += '<td class="text-danger">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ')   ' + '<i class="fa fa-level-up"></i></td>';
				}

				resultHtml += '<td class="hide" id="binancePrice_' + this.coinSymbol +'">'+ this.priceKrwB +'</td>';
				resultHtml += '<td class="hide" id="binanceTrans_' + this.coinSymbol +'">'+ this.transferFeeB+'</td>';
				resultHtml += '<td class="hide" id="upbitPrice_' + this.coinSymbol  +'">'+ this.priceKrwA+'</td>';
				resultHtml += '<td class="hide" id="upbitTrans_' + this.coinSymbol  +'">'+ this.transferFeeA+'</td>';
				
				resultHtml += "</tr>";
				// 마이너스 빨간색 플러스 파란색 
			});
			
			// 텔레그램 메시지 전송
			if(context == 'price' && sendMessage == 'Y'){
				sendTelegramMessage(resultJsonArray);
			}
			
			$("#priceTbodyBTC").html(resultHtml);
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}


/*
 * 현재 사용중 : 업비트-바이낸스 가격 가져오는 function
 */
function getCompareBTC2() {
	var exceptCoinList = "GTO/NPXS/QKC/ETC/STRAT/BCH/";
	var defaultPremium = 5;
	var data = {}
	var teleType = '1';
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare2/BTC",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			var result = data;
			
			// 선택한 코인 조회하기
			var choiceCoinList = $("ul.chosen-choices").find("li>span");
			var choiceCoinStr = '';
			$.each(choiceCoinList, function(){
				var value = $(this).text();
				choiceCoinStr += value + "/";
			})
			
			var choiceCoinStrFixed = 'XRP/';
			// 임시
			if(context == 'admin'){
				choiceCoinStrFixed = "MFT/STMX/BTT/ANKR/TFUEL/NPXS/MBL/VET/SC/";
				// choiceCoinStrFixed = "ONT/XEM/STEEM/IOST/XLM/ICX/GTO/STORM/TRX/NEO/XRP/POWR/ZIL/EOS/SNT/LOOM/";
			}
			
			var resultJsonArray = new Array();
			var resultHtml = "";
			var sendMessage = "N";
			
			// 김치 프리미엄 
			var minPremium = Number($("#minPremium").val());
			var maxPremium = Number($("#maxPremium").val());
			
			// 텔레그램 프리미엄
			var telegram = $("#kimchPreminum").val();
			
			$("#priceTbodyBTC").html('');
			
			$.each(result, function(){
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.coinSymbol2 = this.coinSymbol2;
				resultVO.binanceBuyPrice = this.binanceBuyPrice;
				resultVO.binanceSellPrice = this.binanceSellPrice;
				resultVO.upbitBuyPrice = this.upbitBuyPrice;
				resultVO.upbitSellPrice = this.upbitSellPrice;
				resultVO.coinPriceWeightA = this.coinPriceWeightA;
				resultVO.coinPriceWeightB = this.coinPriceWeightB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapKrw2 = this.priceGapKrw2;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.priceGapPercent2 = this.priceGapPercent2;
				resultVO.binanceBuySatosiPrice = this.binanceBuySatosiPrice;
				resultVO.binanceSellSatosiPrice = this.binanceSellSatosiPrice;
				resultVO.status = this.status;
				resultVO.status = this.status;
				
				var bgClass = "";
				var bgClass2 = "";
				
				if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-success";
				}
				
				
				if(choiceCoinStr.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-info";
				}
				resultHtml += "<tr>";
				
				// resultJsonArray.push(resultVO);
				
				// 코인 심볼명
				resultHtml += "<td>-</td>";
				resultHtml += "<td class='" + bgClass +"'>" + this.coinSymbol + "</td>";

				//----------------------------------------------------------------------------------------------------------------
				// binance 사토시
				resultHtml += '<td class="' + bgClass +'">' + this.binanceBuySatosiPrice +"" + "</td>";
				// binance (매수)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.binanceBuyPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.upbitSellPrice);
				if(bgClass != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				 
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass + '">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + '<i class="fa fa-level-down"></i></td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td class='" + bgClass + "'>" + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ') ' + "</td>";
				}else {
					resultHtml += '<td class="text-danger '+ bgClass +'">' + comma(this.priceGapKrw) + ' (' + comma(this.priceGapPercent) + ')   ' + '<i class="fa fa-level-up"></i></td>';
				}
				//----------------------------------------------------------------------------------------------------------------

				//----------------------------------------------------------------------------------------------------------------
				resultHtml += "<td class='" + bgClass2 +"'>" + this.coinSymbol2 + "</td>";
				resultHtml += '<td class="' + bgClass2 +'">' + this.binanceSellSatosiPrice;
				// binance 사토시
				if(bgClass2 != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				
				// binance (매수)
				resultHtml += '<td class="font-bold ' + bgClass2 + '">'  + comma(this.binanceSellPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass2 + '">'  + comma(this.upbitBuyPrice);
				resultHtml += "</td>";
				 
				var priceGapPercent2 = this.priceGapPercent2;
				if(priceGapPercent2 == null){
					priceGapPercent2 = '0';
				}else {
					priceGapPercent2 = priceGapPercent2 + '';
				}
				
				if(priceGapPercent2.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass2 + '">' + comma(this.priceGapKrw2) + ' (' + comma(this.priceGapPercent2) + ') ' + '<i class="fa fa-level-down"></i></td>';
				}else if(this.priceGapPercent2 == 0){
					resultHtml += "<td class='" + bgClass2 + "'>" + comma(this.priceGapKrw2) + ' (' + comma(this.priceGapPercent2) + ') ' + "</td>";
				}else {
					resultHtml += '<td class="text-danger ' + bgClass2 + '">' + comma(this.priceGapKrw2) + ' (' + comma(this.priceGapPercent2) + ')   ' + '<i class="fa fa-level-up"></i></td>';
				}

				//----------------------------------------------------------------------------------------------------------------
				
				resultHtml += '<td class="hide" id="binancePrice_' + this.coinSymbol +'">'+ this.binanceBidPrice +'</td>';
				resultHtml += '<td class="hide" id="upbitPrice_' + this.coinSymbol  +'">'+ this.upbitBidPrice+'</td>';
				
				resultHtml += "</tr>";
				// 마이너스 빨간색 플러스 파란색 
				if(exceptCoinList.indexOf(this.coinSymbol2 + '/') <= -1){ 
					if( this.priceGapPercent2 > 5 ){
						resultJsonArray.push(resultVO);
					}
				}
				
				if(exceptCoinList.indexOf(this.coinSymbol + '/') <= -1){ 
					if( this.priceGapPercent < -5){
						teleType = '2';
						resultJsonArray.push(resultVO);
					}
				}
			});

			// 텔레그램 메시지 전송
			if(context == 'admin' && sendMessage == 'Y'){
				// sendTelegramMessage(resultJsonArray, teleType);
			}

			$("#priceTbodyBTC").html(resultHtml);
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}



/*
 * 현재 사용중 : 업비트-바이낸스 가격 가져오는 function
 */
function getCompareBTC3() {
	var usdtList = "MFT/STMX/BTT/MBL/IOST/SC/JST/";
	var exceptCoinList = "BCH/IOTA/BCHA/FLOW/LSK/QKC/BTG/ONG/STRAX/";
	var exceptCoinList2 = "BTG/";		// 빗썸-업비트 페어 (알람 제거)
	var exceptCoinList3 = "AE/BCD/PIVX/BTG/ZIL/BCHA/QKC/BTG/ONG/STRAX/";	// 빗썸-바이낸스 페어 (알람 제거)
	var defaultPremium = 5;
	var data = {}
	var teleType = '1';
	
	// 김프 역프 알림
	audio.pause();
	audio2.pause();
	audio3.pause();
	

	var audioval1 = $("#audio1").val();
	var audioval2 = $("#audio2").val();
	var audioval3 = $("#audio3").val();

	
	// 김프 퍼센트
	
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/priceCompare3/BTC",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			var result = data;
			// 선택한 코인 조회하기
			var choiceCoinList = $("ul.chosen-choices").find("li>span");
			var choiceCoinStr = 'XRP/';
			$.each(choiceCoinList, function(){
				var value = $(this).text();
				choiceCoinStr += value + "/";
			})
			
			var choiceCoinStrFixed = '';
			// 임시
			if(context == 'admin'){
				// choiceCoinStrFixed = "MFT/STMX/BTT/ANKR/TFUEL/NPXS/MBL/VET/SC/";
				// choiceCoinStrFixed = "ONT/XEM/STEEM/IOST/XLM/ICX/GTO/STORM/TRX/NEO/XRP/POWR/ZIL/EOS/SNT/LOOM/";
			}
			
			var resultJsonArray = new Array();
			var resultHtml = "";
			var sendMessage = "Y";
			
			// 김치 프리미엄 
			var minPremium = Number($("#minPremium").val());
			var maxPremium = Number($("#maxPremium").val());
			
			// 텔레그램 프리미엄
			var telegram = $("#kimchPreminum").val();
			
			$("#priceTbodyBTC").html('');
			$("#priceTbodyBTC2").html('');
			$("#priceTbodyBTC3").html('');
			
			
			var result1 = result.upbit;
			var showCount = $("#viewType2").val();
			var showflag = 0;
			
			$.each(result1, function(){
				
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.coinSymbol2 = this.coinSymbol2;
				resultVO.binanceBuyPrice = this.binanceBuyPrice;
				resultVO.binanceSellPrice = this.binanceSellPrice;
				resultVO.upbitBuyPrice = this.upbitBuyPrice;
				resultVO.upbitSellPrice = this.upbitSellPrice;
				resultVO.coinPriceWeightA = this.coinPriceWeightA;
				resultVO.coinPriceWeightB = this.coinPriceWeightB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapKrw2 = this.priceGapKrw2;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.priceGapPercent2 = this.priceGapPercent2;
				resultVO.binanceBuySatosiPrice = this.binanceBuySatosiPrice;
				resultVO.binanceSellSatosiPrice = this.binanceSellSatosiPrice;
				resultVO.status = this.status;
				resultVO.status = this.status;
				resultVO.buyRecommend = this.buyRecommend;
				
				var bgClass = "";
				var bgClass2 = "";
				
				if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-success";
				}
				
				
				if(choiceCoinStr.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-info";
				}
				
				if(showflag < showCount){
					resultHtml += "<tr>";
				}else {
					resultHtml += "<tr style='display:none;'>";
				}
				// resultJsonArray.push(resultVO);
				
				// 코인 심볼명
				// resultHtml += "<td>-</td>";
				
				if(usdtList.indexOf(this.coinSymbol + '/') <= -1){ 
					resultHtml += "<td class='" + bgClass +"'>" + this.coinSymbol + "</td>";
				}else {
					resultHtml += "<td class='" + bgClass +"'>" + this.coinSymbol + ".</td>";
				}
				
				//----------------------------------------------------------------------------------------------------------------
				// binance 사토시
				// resultHtml += '<td class="' + bgClass +'">' + this.binanceBuySatosiPrice +"" + "</td>";
				// binance (매수)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.binanceBuyPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.upbitSellPrice);
				if(bgClass != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				
				if(resultVO.buyRecommend != null){
					resultHtml += '&nbsp;<span class="badge">' + resultVO.buyRecommend + '</span>';
				}		
				
				resultHtml += "</td>";
				 
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass + '">' + comma(this.priceGapPercent) +'%</td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td class='" + bgClass + "'>" + comma(this.priceGapPercent) +'%</td>';
				}else {
					resultHtml += '<td class="text-danger '+ bgClass +'">' + comma(this.priceGapPercent) +'%</td>';
				}
				//----------------------------------------------------------------------------------------------------------------

				//----------------------------------------------------------------------------------------------------------------
				resultHtml += "<td class='" + bgClass2 +"'>" + this.coinSymbol2 + "</td>";
				// resultHtml += '<td class="' + bgClass2 +'">' + this.binanceSellSatosiPrice;
				// binance 사토시
				if(bgClass2 != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				
				// binance (매수)
				resultHtml += '<td class="font-bold ' + bgClass2 + '">'  + comma(this.binanceSellPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass2 + '">'  + comma(this.upbitBuyPrice);
				resultHtml += "</td>";
				 
				var priceGapPercent2 = this.priceGapPercent2;
				if(priceGapPercent2 == null){
					priceGapPercent2 = '0';
				}else {
					priceGapPercent2 = priceGapPercent2 + '';
				}
				
				if(priceGapPercent2.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass2 + '">' + comma(this.priceGapPercent2) +'%</td>';
				}else if(this.priceGapPercent2 == 0){
					resultHtml += "<td class='" + bgClass2 + "'>" + comma(this.priceGapPercent2) +'%</td>';
				}else {
					resultHtml += '<td class="text-danger ' + bgClass2 + '">' + comma(this.priceGapPercent2) +'%</td>';
				}

				//----------------------------------------------------------------------------------------------------------------
				
				resultHtml += '<td class="hide" id="binancePrice_' + this.coinSymbol +'">'+ this.binanceBidPrice +'</td>';
				resultHtml += '<td class="hide" id="upbitPrice_' + this.coinSymbol  +'">'+ this.upbitBidPrice+'</td>';
				
				// console.log("pre1111!:"+pre1);
				// console.log("pre222!:"+pre2);
				
				resultHtml += "</tr>";
				
				// 마이너스 빨간색 플러스 파란색 
				if(exceptCoinList.indexOf(this.coinSymbol2 + '/') <= -1){ 
					if( this.priceGapPercent2 > pre1 ){
						if(audioval2 == "y"){
							// audio2.play();
						}
						teleType = '1';
						resultJsonArray.push(resultVO);
					}
				}
				
				if(exceptCoinList.indexOf(this.coinSymbol + '/') <= -1){ 
					if( this.priceGapPercent < pre2 ){
						if(audioval2 == "y"){
							// audio.play();
						}
						teleType = '2';
						resultJsonArray.push(resultVO);
					}
				}
				
				// 보여주는 코인
				showflag++;
			});

			// 텔레그램 메시지 전송
			if(sendMessage == 'Y'){
				sendTelegramMessage(resultJsonArray, teleType);
			}

			$("#priceTbodyBTC").html(resultHtml);
			
			
			
			// 빗썸 - 업비트 페어
			var result2 = result.bithumb;
			resultHtml = '';
			choiceCoinStrFixed = '';
			choiceCoinStrFixed = "XRP/";
			
			showCount = $("#viewType1").val();
			showflag = 0;
			resultJsonArray = new Array();
			
			$.each(result2, function(){
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.coinSymbol2 = this.coinSymbol2;
				resultVO.binanceBuyPrice = this.binanceBuyPrice;
				resultVO.binanceSellPrice = this.binanceSellPrice;
				resultVO.upbitBuyPrice = this.upbitBuyPrice;
				resultVO.upbitSellPrice = this.upbitSellPrice;
				resultVO.coinPriceWeightA = this.coinPriceWeightA;
				resultVO.coinPriceWeightB = this.coinPriceWeightB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapKrw2 = this.priceGapKrw2;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.priceGapPercent2 = this.priceGapPercent2;
				// resultVO.binanceBuySatosiPrice = this.binanceBuySatosiPrice;
				// resultVO.binanceSellSatosiPrice = this.binanceSellSatosiPrice;
				resultVO.status = this.status;
				resultVO.status = this.status;
				
				var bgClass = "";
				var bgClass2 = "";
				
				if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-success";
				}
				
				
				if(choiceCoinStr.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-info";
				}
				
				if(showflag < showCount){
					resultHtml += "<tr>";
				}else {
					resultHtml += "<tr style='display:none;'>";
				}
				
				// resultJsonArray.push(resultVO);
				
				// 코인 심볼명
				// resultHtml += "<td>-</td>";
				resultHtml += "<td class='" + bgClass +"'>" + this.coinSymbol + "</td>";

				//----------------------------------------------------------------------------------------------------------------
				// binance 사토시
				// resultHtml += '<td class="' + bgClass +'">' + this.binanceBuySatosiPrice +"" + "</td>";
				// binance (매수)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.binanceBuyPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.upbitSellPrice);
				if(bgClass != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				 
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass + '">' + comma(this.priceGapPercent) + '%</td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td class='" + bgClass + "'>" + comma(this.priceGapPercent)  + '%</td>';
				}else {
					resultHtml += '<td class="text-danger '+ bgClass +'">'  + comma(this.priceGapPercent)  + '%</td>';
				}
				//----------------------------------------------------------------------------------------------------------------

				//----------------------------------------------------------------------------------------------------------------
				resultHtml += "<td class='" + bgClass2 +"'>" + this.coinSymbol2 + "</td>";
				// resultHtml += '<td class="' + bgClass2 +'">' + this.binanceSellSatosiPrice;
				// binance 사토시
				if(bgClass2 != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				
				// binance (매수)
				resultHtml += '<td class="font-bold ' + bgClass2 + '">'  + comma(this.binanceSellPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass2 + '">'  + comma(this.upbitBuyPrice);
				resultHtml += "</td>";
				 
				var priceGapPercent2 = this.priceGapPercent2;
				if(priceGapPercent2 == null){
					priceGapPercent2 = '0';
				}else {
					priceGapPercent2 = priceGapPercent2 + '';
				}
				
				if(priceGapPercent2.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass2 + '">' + comma(this.priceGapPercent2)  + '%</td>';
				}else if(this.priceGapPercent2 == 0){
					resultHtml += "<td class='" + bgClass2 + "'>" + comma(this.priceGapPercent2) + '%</td>';
				}else {
					resultHtml += '<td class="text-danger ' + bgClass2 + '">' + comma(this.priceGapPercent2) + '%</td>';
				}

				//----------------------------------------------------------------------------------------------------------------
				
				resultHtml += '<td class="hide" id="binancePrice_' + this.coinSymbol +'">'+ this.binanceBidPrice +'</td>';
				resultHtml += '<td class="hide" id="upbitPrice_' + this.coinSymbol  +'">'+ this.upbitBidPrice+'</td>';
				
				resultHtml += "</tr>";
				// 마이너스 빨간색 플러스 파란색 
				if(exceptCoinList2.indexOf(this.coinSymbol2 + '/') <= -1){ 
					if( this.priceGapPercent2 > 3 ){
						if(audioval1 == "y"){
							// audio3.play();
						}
						teleType = '3';
						resultJsonArray.push(resultVO);
					}
				}
				
				if(exceptCoinList2.indexOf(this.coinSymbol + '/') <= -1){ 
					if( this.priceGapPercent < -3 ){
						if(audioval1 == "y"){
							// audio3.play();
						}
						teleType = '4';
						resultJsonArray.push(resultVO);
					}
				}
				
				// 보여주는 코인
				showflag++;
			});

			// 텔레그램 메시지 전송
			if(sendMessage == 'Y'){
				sendTelegramMessage(resultJsonArray, teleType);
			}

			$("#priceTbodyBTC2").html(resultHtml);
			
			
			
			// 빗썸 - 바이낸스 페어
			var result3 = result.binance;
			resultHtml = '';
			choiceCoinStrFixed = '';
			choiceCoinStrFixed = "XRP/ARPA/CKB/UMA/AAVE/COMP/REN/RLC/GRT/SNX/NU/OXT/LPT/MKR/FRONT/OCEAN/KSM/ALICE/";
			
			showCount = $("#viewType3").val();
			showflag = 0;
			resultJsonArray = new Array();
		
			$.each(result3, function(){
				
				var name = this.closing_price;
				var resultVO = new Object();
				resultVO.coinSymbol = this.coinSymbol;
				resultVO.coinSymbol2 = this.coinSymbol2;
				resultVO.binanceBuyPrice = this.binanceBuyPrice;
				resultVO.binanceSellPrice = this.binanceSellPrice;
				resultVO.upbitBuyPrice = this.upbitBuyPrice;
				resultVO.upbitSellPrice = this.upbitSellPrice;
				resultVO.coinPriceWeightA = this.coinPriceWeightA;
				resultVO.coinPriceWeightB = this.coinPriceWeightB;
				resultVO.priceGapKrw = this.priceGapKrw;
				resultVO.priceGapKrw2 = this.priceGapKrw2;
				resultVO.priceGapPercent = this.priceGapPercent;
				resultVO.priceGapPercent2 = this.priceGapPercent2;
				resultVO.binanceBuySatosiPrice = this.binanceBuySatosiPrice;
				resultVO.binanceSellSatosiPrice = this.binanceSellSatosiPrice;
				resultVO.status = this.status;
				resultVO.status = this.status;
				
				var bgClass = "";
				var bgClass2 = "";
				
				if(choiceCoinStr.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol + '/') > -1){ 
					bgClass = "font-bold alert-success";
				}
				
				
				if(choiceCoinStr.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-warning";
				}else if(choiceCoinStrFixed.indexOf(this.coinSymbol2 + '/') > -1){ 
					bgClass2 = "font-bold alert-info";
				}
				
				if(showflag < showCount){
					resultHtml += "<tr>";
				}else {
					resultHtml += "<tr style='display:none;'>";
				}
				// resultJsonArray.push(resultVO);
				
				// 코인 심볼명
				// resultHtml += "<td>-</td>";
				resultHtml += "<td class='" + bgClass +"'>" + this.coinSymbol + "</td>";

				//----------------------------------------------------------------------------------------------------------------
				// binance 사토시
				// resultHtml += '<td class="' + bgClass +'">' + this.binanceBuySatosiPrice +"" + "</td>";
				// binance (매수)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.binanceBuyPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass +'">' + comma(this.upbitSellPrice);
				if(bgClass != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				 
				var priceGapPercent = this.priceGapPercent;
				if(priceGapPercent == null){
					priceGapPercent = '0';
				}else {
					priceGapPercent = priceGapPercent + '';
				}
				
				if(priceGapPercent.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass + '">' + comma(this.priceGapPercent) +'%</td>';
				}else if(this.priceGapPercent == 0){
					resultHtml += "<td class='" + bgClass + "'>" + comma(this.priceGapPercent) +'%</td>';
				}else {
					resultHtml += '<td class="text-danger '+ bgClass +'">' + comma(this.priceGapPercent) +'%</td>';
				}
				//----------------------------------------------------------------------------------------------------------------

				//----------------------------------------------------------------------------------------------------------------
				resultHtml += "<td class='" + bgClass2 +"'>" + this.coinSymbol2 + "</td>";
				// resultHtml += '<td class="' + bgClass2 +'">' + this.binanceSellSatosiPrice;
				// binance 사토시
				if(bgClass2 != ''){
					resultHtml += '&nbsp;&nbsp; <span class="badge badge-primary"></span>';
				}
				resultHtml += "</td>";
				
				// binance (매수)
				resultHtml += '<td class="font-bold ' + bgClass2 + '">'  + comma(this.binanceSellPrice);
				
				// upbit (매도)
				resultHtml += '<td class="' + bgClass2 + '">'  + comma(this.upbitBuyPrice);
				resultHtml += "</td>";
				 
				var priceGapPercent2 = this.priceGapPercent2;
				if(priceGapPercent2 == null){
					priceGapPercent2 = '0';
				}else {
					priceGapPercent2 = priceGapPercent2 + '';
				}
				
				if(priceGapPercent2.indexOf("-") > -1){
					resultHtml += '<td class="text-success ' + bgClass2 + '">' + comma(this.priceGapPercent2) +'%</td>';
				}else if(this.priceGapPercent2 == 0){
					resultHtml += "<td class='" + bgClass2 + "'>" + comma(this.priceGapPercent2) +'%</td>';
				}else {
					resultHtml += '<td class="text-danger ' + bgClass2 + '">' + comma(this.priceGapPercent2) +'%</td>';
				}

				//----------------------------------------------------------------------------------------------------------------
				
				resultHtml += '<td class="hide" id="binancePrice_' + this.coinSymbol +'">'+ this.binanceBidPrice +'</td>';
				resultHtml += '<td class="hide" id="upbitPrice_' + this.coinSymbol  +'">'+ this.upbitBidPrice+'</td>';
				
				resultHtml += "</tr>";
				// 마이너스 빨간색 플러스 파란색 
				/*
				if(exceptCoinList3.indexOf(this.coinSymbol2 + '/') <= -1){ 
					if( this.priceGapPercent2 > pre1){
						teleType = '5';
						resultJsonArray.push(resultVO);
					}
				}
				
				if(exceptCoinList3.indexOf(this.coinSymbol + '/') <= -1){ 
					if( this.priceGapPercent < pre2){
						teleType = '6';
						resultJsonArray.push(resultVO);
					}
				}
				*/			
				// 보여주는 코인
				showflag++;
			});

			// 텔레그램 메시지 전송
			if(sendMessage == 'Y'){
				sendTelegramMessage(resultJsonArray, teleType);
			}

			$("#priceTbodyBTC3").html(resultHtml);
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}


/*
 * type : 1: 빗썸-업비트 / 2: 바이낸스-업비트 / 3: 바이낸스-빗썸
 * mode : 1: 모두 / 2: 요약
 */
function viewtype_change(type, mode){
	$('#' + type).val(mode);
}


/*
 
 */
function audio_change(type, mode){
	$('#' + type).val(mode);
}



function getKimp(param, type) {
	$.ajax({
		type : "GET",
		contentType : "application/json",
		url : "/" + context + "/getKimp",
		// data : JSON.stringify(data),
		dataType : 'json',
		timeout : 60000,
		success : function(data) {
			pre2 = Number(data.kimp1);
			pre1 = Number(data.kimp2);
			
		},
		error : function(e) {
			console.log("error");
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}



function sendTelegramMessage(param, type) {
	console.log(param)
	var data = param;
	var vUrl = "/telegram/sendMessage/" + type;
	
	$.ajax({
		type : "POST",
		contentType : "application/json",
		url : vUrl,
		data : JSON.stringify(data),
		dataType : 'json',
		// tradtional : true,				// json List로 받기 위한 설정
		timeout : 5000,
		success : function(data) {
			
			
		},
		error : function(e) {
			console.log("ERROR: ", e);
			display(e);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}