package jk.framework.web.price.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;

import jk.framework.web.admin.entity.PriceCompareEntity;

@Mapper
public interface PriceInfoMapper {
	
	public List<PriceCompareEntity> selectAllCoinPrice(String coinSymbol) throws DataAccessException;
}

