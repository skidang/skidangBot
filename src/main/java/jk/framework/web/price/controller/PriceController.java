package jk.framework.web.price.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

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

import jk.framework.common.util.etc.SessionService;
import jk.framework.rest.binance.service.BinanacePublicRestService;
import jk.framework.rest.upbit.service.UpbitPublicRestService;
import jk.framework.web.admin.controller.AdminController;
import jk.framework.web.admin.entity.ExchangeRateEntity;
import jk.framework.web.admin.entity.ExchangeRateEntity2;
import jk.framework.web.admin.entity.PriceCompareEntity;
import jk.framework.web.admin.service.AdminService;
import jk.framework.web.price.service.PriceService;

/**
 * Handles requests for the application home page. 
 */
@RequestMapping("/price")
@Controller
public class PriceController {
	
	private static final Logger logger = LoggerFactory.getLogger(PriceController.class);
	
	// bithumb apiKey
    @Value("${bithumb.apiConnectKey}")
    private String apiConnectKey ;
    @Value("${bithumb.apiSecretKey}")
    private String apiSecretKey;
    
    @Value("${binance.apiUrl}")
    private String binanceApiUrl ;
    @Value("${upbit.apiUrl}")
    private String upbitApiUrl ;
	
    @Autowired
    BinanacePublicRestService binancePublicService;

    @Autowired
    UpbitPublicRestService upbitPublicService;
    
    @Autowired
    PriceService priceService;
    
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
		// getPriceExchangeRate(model);
		mav.setViewName("/price/priceCompare");
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
    	List<PriceCompareEntity> result = new ArrayList<PriceCompareEntity>();
    	result = priceService.selectAllCoinPrice(symbolType);
    	
    	// ????????? ???????????? ??????
    	Collections.sort(result, new GapPercentDescCompare());
    	 		
    	if(symbolType.equals("BTC")) {
	 		result = adminService.getPriceHistory(result);
	 	}

    	return result;
	}
    
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
    	    
			sessionService.setAttribute("exchangeRate", String.valueOf(exchangeRate) );
		}
		return result;
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
}
