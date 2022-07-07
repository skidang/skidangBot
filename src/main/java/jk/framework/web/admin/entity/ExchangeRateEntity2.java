/*
 * Copyright yysvip.tistory.com.,LTD.
 * All rights reserved.
 * 
 * This software is the confidential and proprietary information
 * of yysvip.tistory.com.,LTD. ("Confidential Information").
 */
package jk.framework.web.admin.entity; 

import com.fasterxml.jackson.annotation.JsonProperty;

import jk.framework.rest.common.entity.RestCommonVO;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
@EqualsAndHashCode(callSuper=false)
public class ExchangeRateEntity2 extends RestCommonVO{
	/*
	 * [{"code":"FRX.KRWUSD","currencyCode":"USD","currencyName":"달러","country":"미국","name":"미국 (KRW/USD)","date":"2021-08-13","time":"20:01:49","recurrenceCount":383,"basePrice":1169.00,"openingPrice":1158.90,"highPrice":1170.00,"lowPrice":1158.90,"change":"RISE","changePrice":5.50,"cashBuyingPrice":1189.45,"cashSellingPrice":1148.55,"ttBuyingPrice":1157.60,"ttSellingPrice":1180.40,"tcBuyingPrice":null,"fcSellingPrice":null,"exchangeCommission":1.9455,"usDollarRate":1.0000,"high52wPrice":1193.00,"high52wDate":"2020-09-04","low52wPrice":1080.40,"low52wDate":"2021-01-04","currencyUnit":1,"provider":"하나은행","timestamp":1628852510337,"id":79,"createdAt":"2016-10-21T06:13:34.000+0000","modifiedAt":"2021-08-13T11:01:50.000+0000","changeRate":0.0047271165,"signedChangePrice":5.50,"signedChangeRate":0.0047271165}]
	 */
	@JsonProperty("date")
	private String date;			// 날짜
	@JsonProperty("time")
	private String time;			// 한국거래소 원화 가격 
	@JsonProperty("basePrice")
	private String basePrice;			// 환율
	
}
