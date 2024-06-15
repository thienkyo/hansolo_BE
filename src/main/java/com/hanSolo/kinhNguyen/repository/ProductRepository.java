package com.hanSolo.kinhNguyen.repository;

import com.hanSolo.kinhNguyen.facade.ProductInterface;
import com.hanSolo.kinhNguyen.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.lang.NonNull;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends PagingAndSortingRepository<Product, Integer> {
    @Transactional
    @Modifying
    @Query("update Product p set p.status = ?1, p.gmtModify = ?2 where p.id = ?3")
    int updateStatusAndGmtModifyById(Boolean status, Date gmtModify, Integer id);

    Page<ProductInterface> findByCategories_IdAndStatusOrderByGmtModifyDesc(Integer id, Boolean status, Pageable pageable);

    Page<ProductInterface> findByStatusOrderByGmtModifyDesc(Boolean status, Pageable pageable);

    Page<ProductInterface> findByCategories_IdNotOrderByGmtModifyDesc(@NonNull Integer id, Pageable pageable);

    Page<Product> findByCategories_IdNotAndStatusOrderByGmtModifyDesc(@NonNull Integer id, Boolean status, Pageable pageable);

    List<Product> findFirst8ByStatusOrderByGmtModifyDesc(int status);

    List<ProductInterface> findByNameContainsIgnoreCaseAndStatus(@NonNull String name, Boolean status);

    List<ProductInterface> findByNameContainsIgnoreCase(@NonNull String name);

    // for homePage, get 8 new product
    List<ProductInterface> findFirst8ByStatusAndDiscountOrderByGmtModifyDesc(Boolean status, Integer discount);
    // for homePage, get 4 discount product
    List<ProductInterface> findFirst4ByStatusAndDiscountGreaterThanOrderByGmtModifyDesc(Boolean status, Integer discount);

    Optional<Product> findByIdAndStatus(Integer id, Boolean status);

    List<Product> findFirst100ByOrderByGmtModifyDesc();

    List<Product> findFirst100ByCategories_IdOrderByGmtModifyDesc(Integer id);

    List<Product> findByCategories_IdOrderByGmtModifyDesc(Integer id);

    List<Product> findByOrderByGmtModifyDesc();

}