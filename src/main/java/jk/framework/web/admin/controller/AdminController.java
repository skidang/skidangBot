package jk.framework.web.admin.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jk.framework.common.util.etc.JKStringUtil;
import jk.framework.common.util.etc.SessionService;
import jk.framework.rest.binance.entity.BinanceAskResultEntity;
import jk.framework.rest.binance.entity.BinanceTickerResultEntity;
import jk.framework.rest.binance.service.BinanacePublicRestService;
import jk.framework.rest.bithumb.service.BithumbPublicRestService;
import jk.framework.rest.upbit.entity.UpbitResultEntity;
import jk.framework.rest.upbit.entity.UpbitTickerResultEntity;
import jk.framework.rest.upbit.service.UpbitPublicRestService;
import jk.framework.web.admin.entity.CommonInfoEntity;
import jk.framework.web.admin.entity.ExchangeRateEntity;
import jk.framework.web.admin.entity.ExchangeRateEntity2;
import jk.framework.web.admin.entity.KimpEntity;
import jk.framework.web.admin.entity.PriceCompareAskBidEntity;
import jk.framework.web.admin.entity.PriceCompareCommonAskBidEntity;
import jk.framework.web.admin.entity.PriceCompareCommonAskBidEntity2;
import jk.framework.web.admin.entity.PriceCompareEntity;
import jk.framework.web.admin.entity.PriceExchangeInfoEntity;
import jk.framework.web.admin.service.AdminService;

/**
 * Handles requests for the application home page. 
 */
@RequestMapping("/admin")
@Controller
public class AdminController {
	
	private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
 
    @Value("${binance.apiUrl}")
    private String binanceApiUrl ;
    @Value("${upbit.apiUrl}")
    private String upbitApiUrl ;
    @Value("${upbit.apiUrl2}")
    private String upbitApiUrl2 ;
    @Value("${huobi.apiUrl}")
    private String huobiApiUrl ;
    @Value("${bithumb.apiUrl}")
    private String bithumbApiUrl ;
    @Value("${buyPrice}")
    private String buyPrice ;
	
    @Autowired
    BinanacePublicRestService binancePublicService;

    @Autowired
    UpbitPublicRestService upbitPublicService;
    
    @Autowired
    BithumbPublicRestService bithumbPublicService;
    
    @Autowired
    AdminService adminService;
    
    @Autowired
    SessionService sessionService;
	
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????? ??????
     * 2. ???????????? : 
     * </pre>
     * @Method Name : compare
     * @date : 2018. 4. 13.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 13.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @RequestMapping(value = "/compare", method = RequestMethod.GET)
	public ModelAndView compare(Model model) {
		ModelAndView mav = new ModelAndView();
		// ?????? ????????????
		getExchangeRate(model);		
		mav.setViewName("/admin/priceCompare");
		return mav;
    }
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????? ??????
     * 2. ???????????? : 
     * </pre>
     * @Method Name : compare
     * @date : 2018. 4. 13.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 13.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @RequestMapping(value = "/compare2", method = RequestMethod.GET)
	public ModelAndView compare2(Model model) {
		ModelAndView mav = new ModelAndView();
		// ?????? ????????????
		getExchangeRate(model);		
		mav.setViewName("/admin/priceCompare2");
		return mav;
    }
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????? ?????? (?????????-gateIO)
     * 2. ???????????? : 
     * </pre>
     * @Method Name : compare
     * @date : 2018. 4. 13.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 13.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @RequestMapping(value = "/compare3", method = RequestMethod.GET)
	public ModelAndView compare3(Model model) {
		ModelAndView mav = new ModelAndView();
		// ?????? ????????????
		getExchangeRate(model);		
		mav.setViewName("/admin/priceCompare3");
		return mav;
    }
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????????
     * 2. ???????????? : 
     * 	2.1 ???????????? ???????????? ????????????. (KRW)
     * 	2.2 ??????????????? ???????????? ????????????. (USDT ??????..)
     * 	2.3 ??? ?????? merge ?????? ??????
     * </pre>
     * @Method Name : priceCompare
     * @date : 2018. 4. 16.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 16.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @ResponseBody
    @RequestMapping(value = "/priceCompare/{symbolType}", method = RequestMethod.GET)
   	public List<PriceCompareEntity> priceCompare(Model model, @PathVariable String symbolType) {
    	// ?????? ???????????? ??????
    	List<PriceCompareEntity> result = new ArrayList<PriceCompareEntity>();
    	
    	// ?????? ????????????
    	Double exchangeRate = 1190D;
    	if(sessionService.getAttributeStr("exchangeRate") != null) {
    		exchangeRate = Double.parseDouble(sessionService.getAttributeStr("exchangeRate"));
    	}
 		
 		// USDT / BTC ?????? ?????? symbol ?????????
 		HashSet<String> coinList = new HashSet<String>();
 	 	
 		// ????????? ?????? ?????? ?????? ????????????
 		Map<String, PriceCompareEntity> resultEntity = new HashMap<String, PriceCompareEntity>();
 		PriceExchangeInfoEntity param = new PriceExchangeInfoEntity();
 		param.setCoinExchangeType(symbolType);
 		// ????????? ?????? ???????????? (?????? ?????????)
 		List<PriceExchangeInfoEntity> entityList = adminService.getAllExchangeInfo(param);
 		
 		// ????????? ?????? ??????
 	 	for (PriceExchangeInfoEntity e : entityList) {
 	 		boolean listPut = false;
 	 		if("USDT".equals(symbolType)) {
 	 			if("USDT".equals(e.getCoinExchangeType())) {
 	 				listPut = true;
 	 			}
 	 		}else if("BTC".equals(symbolType)) {
 	 			if("BTC".equals(e.getCoinExchangeType()) || "KRW".equals(e.getCoinExchangeType())){
 	 				listPut = true;
 	 			}
 	 		}
 	 		
 	 		if(listPut) {
	 	 		// logger.info("{}------coin::::{}", symbolType, e.getCoinSymbolName());
	 	 		coinList.add( e.getCoinSymbolName());
	
	 	 		/* 
	 	 		 * 	?????? ????????? ??????
	 	 		 *	- ????????? ????????? ??????
	 	 		 */
	 	 		PriceCompareEntity entity = new PriceCompareEntity();
				entity.setCoinSymbol(e.getCoinSymbolName());
				if("upbit".equals(e.getExchangeName())) {
					if(resultEntity.containsKey(entity.getCoinSymbol())){
						resultEntity.get(entity.getCoinSymbol()).setTransferFeeA(e.getCoinTransFeeKrw());
					}else {
						entity.setTransferFeeA(e.getCoinTransFeeKrw());
					}
				}else if("binance".equals(e.getExchangeName())) {
					if(resultEntity.containsKey(entity.getCoinSymbol())){
						resultEntity.get(entity.getCoinSymbol()).setTransferFeeB(e.getCoinTransFeeKrw());
					}else {
						entity.setTransferFeeB(e.getCoinTransFeeKrw());
					}
				}
				
				if(!resultEntity.containsKey(entity.getCoinSymbol())){ 
					resultEntity.put(entity.getCoinSymbol(), entity);
				}
 	 		}
 		}
 	 	
 	 	List<BinanceTickerResultEntity> binanceResultEntity = binancePublicService.getTicker(binanceApiUrl,coinList, symbolType);
 		for (BinanceTickerResultEntity entity : binanceResultEntity) {
 			if("USDT".equals(symbolType)){
 				if(resultEntity.containsKey(entity.getTradeType())){
 					// USDT or BTC
 					String lastPrice = JKStringUtil.nvl(entity.getLastPrice(), "-");
 					resultEntity.get(entity.getTradeType()).setPriceUsdtB(String.valueOf(JKStringUtil.mathRound(lastPrice,2)));
 					if(!("-").equals(lastPrice)) {
 						// ?????? ?????????????????? ?????????
 						double priceKrw = JKStringUtil.parseDouble(lastPrice) * exchangeRate;
 						resultEntity.get(entity.getTradeType()).setPriceKrwB(JKStringUtil.mathKrwRound(priceKrw) );
 					}
 				}
 				// BTC - KRW??? Session??? ????????? ??????.
 	 			if("BTCUSDT".equals(entity.getSymbol())){
 	 				sessionService.setAttribute("BTCKRW", resultEntity.get("BTC").getPriceKrwB());
 	 				sessionService.setAttribute("BTCKRW_UPDATE_DT", JKStringUtil.getNowTime());
 	 				logger.info("BTCKRW:::{}", sessionService.getAttribute("BTCKRW"));
 	 			}
 			}else if("BTC".equals(symbolType)) {
 				if(resultEntity.containsKey(entity.getTradeType())){
 					double btckrw = Double.parseDouble(sessionService.getAttributeStr("BTCKRW"));
 					String lastPrice = JKStringUtil.nvl(entity.getLastPrice(), "-");
 					resultEntity.get(entity.getTradeType()).setPriceBtcB(String.valueOf(lastPrice));
 					
 					// ????????? ?????? (?????? 10???)
 					if(!("-").equals(lastPrice)) {
 						// ?????? ?????????????????? ?????????
 						double priceKrw = JKStringUtil.parseDouble(lastPrice) * btckrw;
 						resultEntity.get(entity.getTradeType()).setPriceKrwB(String.valueOf(JKStringUtil.mathRound(priceKrw,2)) );
 						
 						// ????????? ????????? -> ?????? ??????
 	 					String transferFee = resultEntity.get(entity.getTradeType()).getTransferFeeB();
 	 					String transferFeeSum = JKStringUtil.mathKrwRound(priceKrw * JKStringUtil.parseDouble(transferFee));
 	 					resultEntity.get(entity.getTradeType()).setTransferFeeB(transferFeeSum);
 	 					
 	 					/*
 	 					double priceKrw2 = JKStringUtil.parseDouble(resultEntity.get(entity.getTradeType()).getPriceBtcB2()) * btckrw;
 	 					resultEntity.get(entity.getTradeType()).setPriceKrwB2(String.valueOf(JKStringUtil.mathRound(priceKrw2,2)) );
 	 					*/
 					}
 				}
 			}else {
 				return null;		// ???????????? ?????????
 			}
 		}

 		List<UpbitTickerResultEntity> upBitResultEntity = upbitPublicService.getTicker(upbitApiUrl, coinList);
 		for (UpbitTickerResultEntity entity : upBitResultEntity) {
 			if(resultEntity.containsKey(entity.getTradeType())){
 				String priceKrwA = JKStringUtil.nvl(entity.getTradePrice(), "-");
 				String priceKrwB = JKStringUtil.nvl(resultEntity.get(entity.getTradeType()).getPriceKrwB(), "-");
 				// ????????? ?????? ????????? ???????????????.
 				if(!("-").equals(priceKrwA)) {
 					resultEntity.get(entity.getTradeType()).setPriceKrwA(String.valueOf(JKStringUtil.mathRound(priceKrwA,2)));
 					// ?????? ????????? ???????????? ?????? ???????????? ????????? ???????????????. ???????????? ??? ???????????? ??????
 					if(!("-").equals(priceKrwB)) {
 						double krwGap = Double.parseDouble(priceKrwA) - Double.parseDouble(priceKrwB);
 						resultEntity.get(entity.getTradeType()).setPriceGapKrw(String.valueOf(JKStringUtil.mathRound(krwGap,2)));
 						
 						/* ?????? : ((????????? - ????????????) x 100) / ???????????? (%)
 				         * ???, ???????????? ????????? ???????????? ????????? ???????????????.
 						 */
 						// double priceGapPercent = ((Double.parseDouble(priceKrwA) - Double.parseDouble(priceKrwB)) * 100) / Double.parseDouble(priceKrwB);
 						double priceGapPercent = ((Double.parseDouble(priceKrwA) - Double.parseDouble(priceKrwB)) * 100) / Double.parseDouble(priceKrwB);
 						resultEntity.get(entity.getTradeType()).setPriceGapPercent(JKStringUtil.mathRound(priceGapPercent,2));
 						
 						// ????????? ????????? -> ?????? ??????
 	 					String transferFee = resultEntity.get(entity.getTradeType()).getTransferFeeA();
 	 					String transferFeeSum = JKStringUtil.mathKrwRound(JKStringUtil.parseDouble(priceKrwA) * JKStringUtil.parseDouble(transferFee));
 	 					resultEntity.get(entity.getTradeType()).setTransferFeeA(transferFeeSum);
 					}
 				}
 			}
 		}
 		
 		// ??? ?????? ?????? ??????
 		for( String key : resultEntity.keySet() ){
 			result.add(resultEntity.get(key));
 	        // logger.info("??? : {}, ??? : {}", key, resultEntity.get(key));
 	    }
 		
 		// ????????? ???????????? ??????
 		Collections.sort(result, new GapPercentDescCompare());
 		
 		if(symbolType.equals("BTC")) {
	 		
 			// 1. 10????????? ?????? Update
	 		if(sessionService.getAttributeInt("priceCompare") < 600) {
	 			sessionService.setAttributeInt("priceCompare",sessionService.getAttributeInt("priceCompare") + 15);
	 		}else {
	 			adminService.updateCoinPriceInfo(result);
	 			sessionService.setAttributeInt("priceCompare", 15);
	 		}
	 		
	 		// 2. 2?????? ?????? ???????????? ??????
	 		if(sessionService.getAttributeInt("historyDeleteTime") < 7200) {
	 			sessionService.setAttributeInt("historyDeleteTime",sessionService.getAttributeInt("historyDeleteTime") + 15);
	 			// 30????????? DB??? ??????
	 			if( sessionService.getAttributeInt("historyDeleteTime") % 30 == 0) {
	 				adminService.insertPriceHistory(result);
	 			}
	 		}else {
	 			adminService.deletePriceHistory(coinList);
	 			sessionService.setAttributeInt("historyDeleteTime", 15);
	 		}
	 		result = adminService.getPriceHistory(result);
	 		
	 		
	 		// logger.debug("compareTime:::{}", sessionService.getAttributeInt("priceCompare"));
	 	}
 		
 		
 		if(symbolType.equals("BTC")) {
 			adminService.updateBtcCoinPrice(result);
 		}else if(symbolType.equals("USDT")) {
 			// adminService.updateUsdtCoinPrice(result);
 		}
 		
 		
 		return result;
	}
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????????
     * 2. ???????????? : 
     * 	2.1 ???????????? ???????????? ????????????. (KRW)
     * 	2.2 ??????????????? ???????????? ????????????. (USDT ??????..)
     * 	2.3 ??? ?????? merge ?????? ??????
     * </pre>
     * @Method Name : priceCompare
     * @date : 2018. 4. 16.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 16.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????????
     * 2. ???????????? : 
     * 	2.1 ???????????? ???????????? ????????????. (KRW)
     * 	2.2 ??????????????? ???????????? ????????????. (USDT ??????..)
     * 	2.3 ??? ?????? merge ?????? ??????
     * </pre>
     * @Method Name : priceCompare
     * @date : 2018. 4. 16.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 16.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @ResponseBody
    @RequestMapping(value = "/priceCompare2/{symbolType}", method = RequestMethod.GET)
   	public List<PriceCompareAskBidEntity> priceCompare2(Model model, @PathVariable String symbolType) {
    	// ?????? ???????????? ??????
    	List<PriceCompareAskBidEntity> result = new ArrayList<PriceCompareAskBidEntity>();
    	
    	// ?????? ????????????
    	Double exchangeRate = 1190D;
    	if(sessionService.getAttributeStr("exchangeRate") != null) {
    		exchangeRate = Double.parseDouble(sessionService.getAttributeStr("exchangeRate"));
    	}
    	
    	// BTC ?????? ?????? symbol ?????????
 		HashSet<String> coinList = new HashSet<String>();
 		// USDT ?????? ?????? symbol ?????????
 		HashSet<String> coinList2 = new HashSet<String>();
 	 	coinList2.add("BTC");
 		
 		// ????????? ?????? ?????? ?????? ????????????
 		Map<String, PriceCompareAskBidEntity> resultEntity = new HashMap<String, PriceCompareAskBidEntity>();
 		PriceExchangeInfoEntity param = new PriceExchangeInfoEntity();
 		param.setCoinExchangeType(symbolType);
 		// ????????? ?????? ???????????? (?????? ?????????)
 		List<PriceExchangeInfoEntity> entityList = adminService.getAllExchangeInfo(param);
 		
 		// ????????? ?????? ??????
 	 	for (PriceExchangeInfoEntity e : entityList) {
 	 		boolean listPut = false;
 	 		if("binance".equals(e.getExchangeName()) || "upbit".equals(e.getExchangeName()) ) {
	 	 		if("USDT".equals(symbolType)) {
	 	 			if("USDT".equals(e.getCoinExchangeType())) {
	 	 				listPut = true;
	 	 			}
	 	 		}else if("BTC".equals(symbolType)) {
	 	 			if("BTC".equals(e.getCoinExchangeType()) || "KRW".equals(e.getCoinExchangeType())){
	 	 				listPut = true;
	 	 			}
	 	 		}
 	 		}
 	 		
 	 		if(listPut) {
	 	 		coinList.add( e.getCoinSymbolName());
	 	 		PriceCompareAskBidEntity entity = new PriceCompareAskBidEntity();
				entity.setCoinSymbol(e.getCoinSymbolName());
							
				if(!resultEntity.containsKey(entity.getCoinSymbol())){ 
					resultEntity.put(entity.getCoinSymbol(), entity);
				}
 	 		}
 		}
 	 	
 	 	// ???????????? USDT-BTC ???????????? ?????? ?????? ?????????
 	 	List<BinanceTickerResultEntity> binanceResultEntity = binancePublicService.getTicker(binanceApiUrl,coinList2, symbolType);
 		for (BinanceTickerResultEntity entity : binanceResultEntity) {
 			if("USDT".equals(symbolType)){
 				if(resultEntity.containsKey(entity.getTradeType())){
 					// USDT or BTC
 					String lastPrice = JKStringUtil.nvl(entity.getLastPrice(), "-");
 					resultEntity.get(entity.getTradeType()).setPriceUsdtB(String.valueOf(JKStringUtil.mathRound(lastPrice,2)));
 					if(!("-").equals(lastPrice)) {
 						// ?????? ?????????????????? ?????????
 						double priceKrw = JKStringUtil.parseDouble(lastPrice) * exchangeRate;
 						resultEntity.get(entity.getTradeType()).setPriceKrwB(JKStringUtil.mathKrwRound(priceKrw) );
 					}
 				}
 	 			if("BTCUSDT".equals(entity.getSymbol())){
 	 				sessionService.setAttribute("BTCKRW", resultEntity.get("BTC").getPriceKrwB());
 	 				sessionService.setAttribute("BTCKRW_UPDATE_DT", JKStringUtil.getNowTime());
 	 				logger.info("BTCKRW:::{}", sessionService.getAttribute("BTCKRW"));
 	 			}
 			}
 		}
 	 	
 		Double buyPriceDouble = Double.valueOf(buyPrice);
 	 	// ?????? ????????? ?????? ??????????????? ?????? (????????? ??????.. ?????????)
 	 	// ?????? ???????????? ?????? binanceResultEntity??? merge
 	 	List<BinanceAskResultEntity> askEntityList = binancePublicService.getBidAskPrice(binanceApiUrl,coinList, symbolType, exchangeRate, buyPriceDouble);
 	 	for (BinanceAskResultEntity e : askEntityList) {
 			if(resultEntity.containsKey(e.getCoinSymbolName())){
 				resultEntity.get(e.getCoinSymbolName()).setBinanceBuyPrice(String.valueOf(JKStringUtil.mathRound(e.getBidCoinAveragePrice(),2)));
 				resultEntity.get(e.getCoinSymbolName()).setBinanceSellPrice(String.valueOf(JKStringUtil.mathRound(e.getAskCoinAveragePrice(),2)));
 				resultEntity.get(e.getCoinSymbolName()).setBinanceBuySatosiPrice(String.valueOf(e.getBidCoinSatosiPrice()));
 				resultEntity.get(e.getCoinSymbolName()).setBinanceSellSatosiPrice(String.valueOf(e.getAskCoinSatosiPrice()));
			}
		}
 	 	
 	 	List<UpbitResultEntity> askEntityList2 = upbitPublicService.getBidAskPrice(upbitApiUrl2,coinList, symbolType, exchangeRate, buyPriceDouble);
 		for (UpbitResultEntity e : askEntityList2) {
 			if(resultEntity.containsKey(e.getCoinSymbolName())){
 				resultEntity.get(e.getCoinSymbolName()).setUpbitBuyPrice(String.valueOf(JKStringUtil.mathRound(e.getBidCoinAveragePrice(),2)));
 				resultEntity.get(e.getCoinSymbolName()).setUpbitSellPrice(String.valueOf(JKStringUtil.mathRound(e.getAskCoinAveragePrice(),2)));
			}
		}
		
 	
 		for (String str : coinList) {
 			if(resultEntity.containsKey(str)){
 				String binanceBuyPrice = JKStringUtil.nvl(resultEntity.get(str).getBinanceBuyPrice(), "-");
 				String binanceSellPrice = JKStringUtil.nvl(resultEntity.get(str).getBinanceSellPrice(), "-");
 				String upbitBuyPrice = JKStringUtil.nvl(resultEntity.get(str).getUpbitBuyPrice(), "-");
 				String upbitSellPrice = JKStringUtil.nvl(resultEntity.get(str).getUpbitSellPrice(), "-");
 				
 				// ?????? ?????? / ?????? ??????
 				if(!("-").equals(binanceBuyPrice) && (!("-").equals(upbitSellPrice))) {
 					double krwGap = Double.parseDouble(upbitSellPrice) - Double.parseDouble(binanceBuyPrice);
					resultEntity.get(str).setPriceGapKrw(String.valueOf(JKStringUtil.mathRound(krwGap,2)));
					double priceGapPercent = ((Double.parseDouble(upbitSellPrice) - Double.parseDouble(binanceBuyPrice)) * 100) / Double.parseDouble(binanceBuyPrice);
					resultEntity.get(str).setPriceGapPercent(JKStringUtil.mathRound(priceGapPercent,2));
 				}
 				if(!("-").equals(binanceSellPrice) && (!("-").equals(upbitBuyPrice))) {
					double krwGap = Double.parseDouble(upbitBuyPrice) - Double.parseDouble(binanceSellPrice);
					resultEntity.get(str).setPriceGapKrw2(String.valueOf(JKStringUtil.mathRound(krwGap,2)));
					double priceGapPercent = ((Double.parseDouble(upbitBuyPrice) - Double.parseDouble(binanceSellPrice)) * 100) / Double.parseDouble(binanceSellPrice);
					resultEntity.get(str).setPriceGapPercent2(JKStringUtil.mathRound(priceGapPercent,2));
 				}
 			}
		}

    	List<PriceCompareAskBidEntity> result1 = new ArrayList<PriceCompareAskBidEntity>();
    	List<PriceCompareAskBidEntity> result2 = new ArrayList<PriceCompareAskBidEntity>();
    	
 		// ??? ?????? ?????? ??????
 		for( String key : resultEntity.keySet() ){
 			result1.add(resultEntity.get(key));
 	        // logger.info("??? : {}, ??? : {}", key, resultEntity.get(key));
 	    }
 		
 		// ?????? ?????? (deep copy)
 		for(int i=0; i<result1.size(); i++) {
 			result2.add(new PriceCompareAskBidEntity(result1.get(i)));
 		}
 		
 		// ????????? ???????????? ?????? (?????????)
 		Collections.sort(result1, new GapPercentAscCompare2());
 		// ????????? ?????? ?????? (?????????)
 		Collections.sort(result2, new GapPercent2DescCompare2());
 		
 		for(int i=0; i<result1.size(); i++) {
			result1.get(i).setCoinSymbol2(result2.get(i).getCoinSymbol());
			result1.get(i).setBinanceSellSatosiPrice(result2.get(i).getBinanceSellSatosiPrice());
			result1.get(i).setUpbitBuyPrice(result2.get(i).getUpbitBuyPrice());
			result1.get(i).setBinanceSellPrice(result2.get(i).getBinanceSellPrice());
			result1.get(i).setPriceGapKrw2(result2.get(i).getPriceGapKrw2());
			result1.get(i).setPriceGapPercent2(result2.get(i).getPriceGapPercent2());
		}
 		
 		return result1;
	}
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????????
     * 2. ???????????? : 
     * 	2.1 ???????????? ???????????? ????????????. (KRW)
     * 	2.2 ??????????????? ???????????? ????????????. (USDT ??????..)
     * 	2.3 ??? ?????? merge ?????? ??????
     * </pre>
     * @Method Name : priceCompare
     * @date : 2018. 4. 16.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 16.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @ResponseBody
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @RequestMapping(value = "/priceCompare3/{symbolType}", method = RequestMethod.GET)
   	public Map<String, Object> priceCompare3(Model model, @PathVariable String symbolType) {
    	System.out.println("??????");
    	
    	if(symbolType.equals("BTC")) {
    		return adminService.getPriceCompare3ForBTC();
    	}
    	else if(symbolType.equals("USDT")) {
    		return adminService.getPriceCompare3ForUSDT();
    	}
    	
    	return null;
	}
    
    /**
     * <pre>
     * 1. ?????? : ?????? ?????? ????????? ??????
     * 2. ???????????? : 
     * </pre>
     * @Method Name : compare
     * @date : 2018. 4. 13.
     * @author : Hyundai
     * @history : ?????? ?????? DB??? Update ??????
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 13.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     * @return
     */ 	
    @ResponseBody
    @RequestMapping(value = "/getExchangeRate", method = RequestMethod.GET)
	public List<ExchangeRateEntity2> getExchangeRate(Model model) {
		// ??????
    	List<ExchangeRateEntity2>  result = adminService.getExchangeRate();
    	
		if(result != null) {
            Double exchangeRate = 0D;	// ??????
    	    for (ExchangeRateEntity2 exchangeRateEntity : result) {
    	    	exchangeRate = Double.parseDouble(exchangeRateEntity.getBasePrice());
    		}
    	    
    	    // jk_common_infomation??? ???????????? ?????? ??????
    	    logger.info("??????111::::{}", String.valueOf(exchangeRate) );
			sessionService.setAttribute("exchangeRate", String.valueOf(exchangeRate) );
		}
		return result;
    }
    
    @ResponseBody
    @RequestMapping(value = "/getBtcKrwPrice", method = RequestMethod.GET)
	public CommonInfoEntity getBtcKrwPrice(Model model) {
    	CommonInfoEntity entity = new CommonInfoEntity();
    	//entity.setBinanceBtcKrwPrice(sessionService.getAttribute("BTCKRW"));
    	//entity.setBtcUpdateDt(sessionService.getAttribute("BTCKRW_UPDATE_DT"));
    	
    	if(!adminService.getSessionMap().isEmpty()) {    		
    		entity.setBinanceBtcKrwPrice(adminService.getSessionMap().get("BTCKRW").toString());
    		entity.setBtcUpdateDt(adminService.getSessionMap().get("BTCKRW_UPDATE_DT").toString());
    	}
    	return entity;
    }
    
    /**
     * ?????? ?????????
     * @param model
     * @return
     */
    @ResponseBody
    @RequestMapping(value = "/getKimp", method = RequestMethod.GET)
	public KimpEntity getKimp(Model model) {
    	
    	// ??????
    	KimpEntity result = adminService.getKimp();
		return result;
    }
    
    /**
     * <pre>
     * 1. ?????? : DB??? ???????????? ?????? ???????????? ?????? ?????? ????????????
     * 2. ???????????? : ?????? ???????????? session??? ???????????? ?????? ??????
     * </pre>
     * @Method Name : getPriceExchangeRate
     * @date : 2018. 4. 20.
     * @author : Hyundai
     * @history : 
     *	-----------------------------------------------------------------------
     *	?????????				?????????						????????????  
     *	----------- ------------------- ---------------------------------------
     *	2018. 4. 20.		Hyundai				?????? ?????? 
     *	-----------------------------------------------------------------------
     * 
     * @param model
     */ 	
    @ResponseBody
    @RequestMapping(value = "/priceExchangeInfo", method = RequestMethod.GET)
	public List<PriceExchangeInfoEntity> priceExchangeInfo(Model model) {
    	Map<String, PriceExchangeInfoEntity> templistEntity = new HashMap<String, PriceExchangeInfoEntity>();
    	List<PriceExchangeInfoEntity> listEntity = new ArrayList<PriceExchangeInfoEntity>();
    	PriceExchangeInfoEntity entity = new PriceExchangeInfoEntity();
    	List<PriceExchangeInfoEntity> entityList = adminService.getAllExchangeInfo(entity);
    	for (PriceExchangeInfoEntity resultEntity : entityList) {
    		sessionService.setAttribute(resultEntity.getExchangeName() + "_" + resultEntity.getCoinSymbolName(), resultEntity.getCoinTransFeeKrw());
 
			if(!templistEntity.containsKey(resultEntity.getCoinSymbolName())){ 
				templistEntity.put(resultEntity.getCoinSymbolName(), resultEntity);
				listEntity.add(resultEntity);
			}
		}
    	
    	return listEntity;
    }
  
    
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentAscCompare implements Comparator<PriceCompareEntity> {
		/**
		 * ????????????(ASC)
		 */
		@Override
		public int compare(PriceCompareEntity arg0, PriceCompareEntity arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 < d2 ? -1 : d1 > d2 ? 1:0;
		}
	}

 
	/**
	 * <pre> ????????? DESC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:46:32
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentDescCompare implements Comparator<PriceCompareEntity> {
		/**
		 * ????????????(DESC)
		 */
		@Override
		public int compare(PriceCompareEntity arg0, PriceCompareEntity arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 > d2 ? -1 : d1 < d2 ? 1:0;
		}
	}
	
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentAscCompare2 implements Comparator<PriceCompareAskBidEntity> {
		/**
		 * ????????????(ASC)
		 */
		@Override
		public int compare(PriceCompareAskBidEntity arg0, PriceCompareAskBidEntity arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 < d2 ? -1 : d1 > d2 ? 1:0;
		}
	}
	
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentAscCompare3 implements Comparator<PriceCompareCommonAskBidEntity> {
		/**
		 * ????????????(ASC)
		 */
		@Override
		public int compare(PriceCompareCommonAskBidEntity arg0, PriceCompareCommonAskBidEntity arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 < d2 ? -1 : d1 > d2 ? 1:0;
		}
	}

	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentAscCompare4 implements Comparator<PriceCompareCommonAskBidEntity2> {
		/**
		 * ????????????(ASC)
		 */
		@Override
		public int compare(PriceCompareCommonAskBidEntity2 arg0, PriceCompareCommonAskBidEntity2 arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 < d2 ? -1 : d1 > d2 ? 1:0;
		}
	}
	
	
	/**
	 * <pre> ????????? DESC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:46:32
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercentDescCompare2 implements Comparator<PriceCompareAskBidEntity> {
		/**
		 * ????????????(DESC)
		 */
		@Override
		public int compare(PriceCompareAskBidEntity arg0, PriceCompareAskBidEntity arg1) {
			double d1 = arg0.getPriceGapPercent();
			double d2 = arg1.getPriceGapPercent();
			return d1 > d2 ? -1 : d1 < d2 ? 1:0;
		}
	}
	
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercent2DescCompare2 implements Comparator<PriceCompareAskBidEntity> {
		/**
		 * ????????????(DESC)
		 */
		@Override
		public int compare(PriceCompareAskBidEntity arg0, PriceCompareAskBidEntity arg1) {
			double d1 = arg0.getPriceGapPercent2();
			double d2 = arg1.getPriceGapPercent2();
			return d1 > d2 ? -1 : d1 < d2 ? 1:0;
		}
	}
	
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercent2DescCompare3 implements Comparator<PriceCompareCommonAskBidEntity> {
		/**
		 * ????????????(DESC)
		 */
		@Override
		public int compare(PriceCompareCommonAskBidEntity arg0, PriceCompareCommonAskBidEntity arg1) {
			double d1 = arg0.getPriceGapPercent2();
			double d2 = arg1.getPriceGapPercent2();
			return d1 > d2 ? -1 : d1 < d2 ? 1:0;
		}
	}
	
	/**
	 * <pre> ????????? ASC
	 * jk.framework.web.price.controller 
	 *    |_ PriceController.java
	 * 
	 * </pre>
	 * @date : 2018. 4. 17. ?????? 9:45:45
	 * @version : 
	 * @author : Hyundai
	 */
	static class GapPercent2DescCompare4 implements Comparator<PriceCompareCommonAskBidEntity2> {
		/**
		 * ????????????(DESC)
		 */
		@Override
		public int compare(PriceCompareCommonAskBidEntity2 arg0, PriceCompareCommonAskBidEntity2 arg1) {
			double d1 = arg0.getPriceGapPercent2();
			double d2 = arg1.getPriceGapPercent2();
			return d1 > d2 ? -1 : d1 < d2 ? 1:0;
		}
	}
}
