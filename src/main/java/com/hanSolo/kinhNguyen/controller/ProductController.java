package com.hanSolo.kinhNguyen.controller;

import com.hanSolo.kinhNguyen.facade.ProductInterface;
import com.hanSolo.kinhNguyen.models.Category;
import com.hanSolo.kinhNguyen.models.Product;
import com.hanSolo.kinhNguyen.repository.ProductRepository;
import com.hanSolo.kinhNguyen.utility.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/products")
public class ProductController {
    @Autowired
    private ProductRepository prodRepo;

    @RequestMapping("homeProduct")
    public List<ProductInterface> getHomeProduct() {
        List<ProductInterface> newProducts = prodRepo.findFirst8ByStatusAndDiscountOrderByGmtModifyDesc(Utility.ACTIVE_STATUS,0);
        List<ProductInterface> discountProducts = prodRepo.findFirst4ByStatusAndDiscountGreaterThanOrderByGmtModifyDesc(Utility.ACTIVE_STATUS,1);
        newProducts.addAll(discountProducts);
        Collections.shuffle(newProducts);

        return newProducts;
    }

    @RequestMapping(value="active/{id}",method = RequestMethod.GET)
    public Product getOneActiveProduct(@PathVariable final int id) {
        return prodRepo.findByIdAndStatus(id, Utility.ACTIVE_STATUS).get();
    }

    @RequestMapping(value = "getProductPage/{cateId}/{pageNumber}", method = RequestMethod.GET)
    public Page<ProductInterface> getProductPage(@PathVariable Integer cateId, @PathVariable Integer pageNumber) {
        Pageable request = PageRequest.of(pageNumber - 1, Utility.PRODUCT_PAGE_SIZE, Sort.Direction.DESC, "id");
        if(cateId == 0){
            return prodRepo.findByStatusOrderByGmtModifyDesc(Utility.ACTIVE_STATUS, request);
        }
        return prodRepo.findByCategories_IdAndStatusOrderByGmtModifyDesc(cateId, Utility.ACTIVE_STATUS, request);
    }
}
