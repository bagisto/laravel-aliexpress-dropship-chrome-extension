window.onload = function() {
  var customUrl;
  var isAuthenticated = false;
  var product_url;
  var price;
  var currency;
  var image;
  var product_name;
  var product_qty;
  var product_id;
  var current_order_id;
  var tempQuantity;
  var urlExist;
  var redirectUrl;
  var customOption = {};
  var updatedCustomOption = [];
  var superAttributes = [];
  var superAttrDetail = [];
  var imageThumbArr = [];
  var imageFinalArr = [];
  var product_meta_title = "";
  var product_meta_desc = "";
  var product_meta_keywords = "";
  var review_url = "";
  var description_url = "";
  var review_count;
  var review_type;
  var custom_review_count = "";
  var checked_swatch = [];
  var checkVariationFetch = 0;
  var productData;

  var host = window.location.host;
  var pathname = window.location.pathname;
  var href = window.location.href;
  var query = window.location.search.substring(1);

  var username = localStorage.aliexpress_import_username;
  var token = localStorage.aliexpress_import_token;
  var url = localStorage.aliexpress_import_url;

  modal =
    '<div class="modal-overlay request-modal"><div class="modal-container"><div class="modal-header"><h3>Register Your Bagisto Store Url</h3></div><div class="modal-body"><div id="wk_info">If your store setup contains any folder then add that folder name like - ex. https://www.example.com/folder_name/</div><div class="input-block"><div class="input-label" <label>Store Url</label></div><div class="block-input"><input type="text" id="url" name="url" value="" /></div></div><div class="modal-footer"><button id="cancel-request-modal" class="cancel" type="button">Cancel</button><button id="request-submit" class="submit" type="button">Next</button></div></div></div>';

  modal2 =
    '<div class="modal-overlay login-modal"><div class="modal-container"><div class="modal-header"><h3>Credentials to access store</h3></div><div class="modal-body"><div class="input-block"><div class="input-label" <label>Username</label></div><div class="block-input"><input type="text" id="username" name="username" value="" /></div></div><div class="input-block"><div class="input-label" <label>Token</label></div><div class="block-input"><input type="text" name="token" id="token" value="" /></div></div></div><div class="modal-footer"><button id="cancel-login-modal" class="cancel" type="button">Cancel</button><button id="login-submit" class="submit" type="button">Submit</button></div></div></div>';

  modalEditProduct =
    '<div class="modal-overlay" id="product-edit-modal"><div class="modal-container"><div class="modal-header"><h3>Edit This Product</h3></div><div class="modal-body"><div class="input-block"><div class="input-label"><label>Name</label></div><div class="block-input"><input type="text" id="productName" name="productName" value="" /></div></div><div class="input-block"><div class="input-label"><label>Price</label></div><div class="block-input"><input type="text" id="productPrice" name="productPrice" value="" /></div></div><div style="display:none;" class="input-block reviews-input-div"><div class="input-label"><label class="review-label"></label></div><div class="block-input"><input type="radio" name="reviews" value="1">All<input type="radio" name="reviews" value="2" checked>None<input type="radio" value="3" name="reviews">Custom<input type="text" style="display:none;" id="custom-review" name="productMetaTitle" value=""></div></div><div class="input-block"><div class="input-label"><label>Meta Tag Title</label></div><div class="block-input"><input type="text" id="productMetaTitle" name="productMetaTitle" value="" /></div></div><div class="input-block"><div class="input-label"><label>Meta Tag Description</label></div><div class="block-input"><textarea id="productMetaDesc" name="productMetaDesc" ></textarea></div></div><div class="input-block"><div class="input-label"><label>Meta Tag Keywords</label></div><div class="block-input"><textarea id="productMetaKey" name="productMetaKey" ></textarea></div></div></div><div class="modal-footer"><button id="cancel-product-edit-modal" class="cancel" type="button">Cancel</button><button id="product-edit-submit" class="submit" type="button">Submit</button></div></div></div>';

  $("body").prepend('<div class="wk-notifer"></div>');
  $("body").prepend(modal);
  $("body").prepend(modal2);
  $("body").prepend(modalEditProduct);
  $("body").on("click", ".wkdropshipextensionalertclosebtn", function() {
    $(this)
      .parent()
      .remove();
  });
  $("#cancel-request-modal").on("click", function() {
    hideLoader();

    $("#wk_user_restrict").remove();
    $(".request-modal").hide();
  });

  $("#cancel-login-modal").on("click", function() {
    hideLoader();

    $("#wk_user_restrict").remove();
    $(".login-modal").hide();
  });

  $("body").on("click", ".wk-delete-img", function() {
    $(this)
      .parent()
      .remove();

    if ($(".wk-delete-img").length == 0) {
      reloadImage =
        '<button id="reload-images">reload previous images</button>';
      $(document)
        .find("#product-edit-modal #wk-images")
        .append(reloadImage);
    }
  });

  $("body").on("click", "#reload-images", function() {
    $(this).remove();

    if (imageThumbArr && imageThumbArr.length > 0) {
      var imagesHtml = "";

      $.each(imageThumbArr, function(index, value) {
        imagesHtml +=
          '<div class="wk-image"><div class="wk-delete-img">X</div><img src="' +
          value +
          '"></div>';
      });

      imagesHtml += "</div></div></div>";

      $(document)
        .find("#product-edit-modal #wk-images")
        .append(imagesHtml);
    }
  });

  function setAlert(type, content) {
    html =
      '<div class="wkdropshipextensionalert wkdropshipextensionalert-' +
      type +
      '"><span class="wkdropshipextensionalertclosebtn">&times;</span>' +
      content +
      "</div>";
    $(".wk-notifer").append(html);
  }

  function removeWarning() {
    $(".wkdropshipextensionalert").each(function(i) {
      $(this)
        .delay(3000)
        .fadeOut();
    });
  }

  function showLoader() {
    html =
      '<div class="wkdropshipextensionalert-default"><div class="cp-spinner cp-meter"></div></div>';
    $("body").prepend(html);
  }

  function hideLoader() {
    $("body .wkdropshipextensionalert-default").remove();
  }

  function findElementByClass(class_name) {
    var ele = $("body").find("." + class_name);

    return ele;
  }

  function getUrlToBeRedirected(url) {
    redirectUrl = "";

    return redirectUrl;
  }

  //implemented for second layout and from category, search page only
  var checkReviews = function() {
    return new Promise(function(resolve, reject) {
      if (!review_count && productData != undefined) {
        $.ajax({
          url:
            "https://feedback.aliexpress.com/display/productEvaluation.htm?v=2&productId=" +
            productData.feedbackModule.productId +
            "&ownerMemberId=" +
            productData.feedbackModule.sellerAdminSeq,
          dataType: "html",
          beforeSend: function() {
            showLoader();
          },
          success: function(response) {
            if ($(response).find(".customer-reviews").length > 0) {
              let tempreviewText = $(response)
                .find(".customer-reviews")
                .text();
              try {
                review_count = parseInt(
                  tempreviewText.split("(")[1].split(")")[0]
                );
                if (review_count == NaN) {
                  review_count = 0;
                }
              } catch (error) {
                review_count = 0;
              }
            }
            hideLoader();
            resolve(true);
          },
          error: function(xhr, ajaxOptions, thrownError) {
            hideLoader();
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    });
  };

  var custAttrImport = function(productUrl) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: productUrl,
        data: {},
        dataType: "html",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          customOption = {};
          product_meta_title = $(response)
            .filter("title")
            .text();
          product_meta_desc = $(response)
            .filter("meta[name=description]")
            .attr("content");
          product_meta_keywords = $(response)
            .filter("meta[name=keywords]")
            .attr("content");
          var attrHtml = $(response).find("div#j-product-info-sku");

          // changes below

          if (attrHtml.length) {
            if ($(attrHtml).find("dl.p-property-item").length > 0) {
              var variation_array = [];
              $(attrHtml)
                .find(".p-property-item")
                .each(function(index) {
                  var title = $(this)
                    .children(".p-item-title")
                    .text();
                  var aliexpressOptions = [];
                  var combinationOpt = [];
                  var attrPropId = $(this)
                    .children(".p-item-main")
                    .find(".sku-attr-list")
                    .attr("data-sku-prop-id");
                  $(this)
                    .children(".p-item-main")
                    .children("ul.sku-attr-list")
                    .find("[data-sku-id]")
                    .each(function(i, v) {
                      var optionid = $(v).attr("data-sku-id");

                      var image = $(v)
                        .children("img")
                        .attr("src");

                      var name = $(v)
                        .children("span")
                        .text();

                      if (name == "") {
                        name = $(v).attr("title");
                      }

                      aliexpressOptions[i] = {
                        name: name,
                        optionid: optionid,
                        image: image
                      };

                      if (image == "" || image == undefined) {
                        image = 0;
                      }

                      combinationOpt[i] = optionid;
                      variation_array[index] = combinationOpt;
                      superAttributes[index] = {
                        attr_id: attrPropId,
                        swatch_type: image ? "image" : "text",
                        title: title,
                        value: aliexpressOptions
                      };
                    });
                });

              if (variation_array) {
                var combination_array = allPossibleCases(variation_array);
                if (combination_array) {
                  $.each(combination_array, function(i, v) {
                    makeCombination(response, v, v.split("_"));
                  });
                }
              }
            }
            imageThumbArr = [];
            if ($(response).find(".img-thumb-item img").length > 0) {
              $($(response).find(".img-thumb-item img")).each(function(i, v) {
                imageThumbArr[i] = $(v)
                  .attr("src")
                  .replace("_50x50.jpg", "");
              });
            }
            if ($(response).find("#feedback iframe").length > 0) {
              review_url = $(response)
                .find("#feedback iframe")
                .attr("thesrc");
            }
            review_count = 0;
            if (
              $(response)
                .find("#j-product-detail-bd")
                .find(".ui-rating")
                .find('span[itemprop="reviewCount"]').length > 0
            ) {
              review_count = $(response)
                .find("#j-product-detail-bd")
                .find(".ui-rating")
                .find('span[itemprop="reviewCount"]')
                .text();
            }
            var keyTokenRegex = /&key=+[\D\d]+&token=+[\w\d]+"/gi.exec(
              response
            );
            if (keyTokenRegex) {
              var keyToken = keyTokenRegex[0].replace('"', "");
              description_url =
                "https://aeproductsourcesite.alicdn.com/product/description/pc/v2/en_US/desc.htm?productId=" +
                product_id +
                keyToken;
            }
            hideLoader();
            resolve(true);
          } else {
            var htmlData = response;
            var productDataHtml = htmlData
              .substring(
                htmlData.lastIndexOf("window.runParams = ") +
                  htmlData
                    .substr(htmlData.lastIndexOf("window.runParams = "))
                    .indexOf("data:") +
                  5,
                htmlData.lastIndexOf("window.runParams = ") +
                  htmlData
                    .substr(htmlData.lastIndexOf("window.runParams = "))
                    .indexOf("csrfToken")
              )
              .trim();
            if (htmlData) {
              try {
                productData = JSON.parse(productDataHtml.replace(/,\s*$/, ""));
              } catch (error) {
                if (window.runParams.data != undefined) {
                  productData = window.runParams.data;
                }
              }
            }
            if (productData != undefined) {
              product_id = productData.storeModule.productId;
              $.each(productData.skuModule.skuPriceList, function(ind, val) {
                let tempComb = val.skuPropIds.split(",").join("_");
                let tempImg = "";
                let tempQuantity = val.skuVal.availQuantity;
                let tempPrice = val.skuVal.actSkuCalPrice;
                if (val.skuVal.skuMultiCurrencyDisplayPrice != undefined) {
                  tempPrice = val.skuVal.skuMultiCurrencyDisplayPrice;
                }

                if (val.skuVal.actSkuMultiCurrencyDisplayPrice != undefined) {
                  tempPrice = val.skuVal.actSkuMultiCurrencyDisplayPrice;
                }

                if (tempPrice == undefined) {
                  tempPrice = val.skuVal.skuCalPrice;
                }

                if (tempPrice.search(".") == -1) {
                  tempPrice = tempPrice.replace(/[,]/gi, ".");
                } else {
                  tempPrice = tempPrice.replace(/[,]/gi, "");
                }

                let tempText = "";

                if (val.skuAttr != undefined) {
                  $.each(val.skuAttr.split(";"), function(indx, valu) {
                    $.each(
                      productData.skuModule.productSKUPropertyList,
                      function(ind2, val2) {
                        $.each(val2.skuPropertyValues, function(ind3, val3) {
                          if (
                            val3.propertyValueId ==
                            valu.split("#")[0].split(":")[1]
                          ) {
                            tempText += val3.propertyValueDisplayName + "+";
                          }

                          if (
                            !val2.showTypeColor &&
                            val2.skuPropertyId ==
                              valu.split("#")[0].split(":")[0] &&
                            val3.propertyValueId ==
                              valu.split("#")[0].split(":")[1] &&
                            val3.skuPropertyImagePath != undefined
                          ) {
                            tempImg = val3.skuPropertyImagePath;
                          }
                        });
                      }
                    );
                  });
                }
                tempText = tempText.substr(0, tempText.length - 1);
                customOption[tempComb] = {
                  comb: tempComb,
                  img: tempImg,
                  price: tempPrice,
                  text: tempText,
                  qty: tempQuantity
                };
              });
              imageThumbArr = productData.imageModule.imagePathList;

              $.each(productData.skuModule.productSKUPropertyList, function(
                ind4,
                val4
              ) {
                var aliexpressOptions = [];

                var search = $(".sku-property-item").find(
                  val4.skuPropertyValues
                );

                $.each(val4.skuPropertyValues, function(ind5, val5) {
                  var tempswatchoptionimg = "";
                  if (val5.skuPropertyImageSummPath != undefined) {
                    tempswatchoptionimg = val5.skuPropertyImageSummPath;
                  }

                  aliexpressOptions[ind5] = {
                    name: val5.propertyValueDisplayName,
                    optionid: val5.propertyValueId,
                    img: tempswatchoptionimg
                  };

                  if (!tempswatchoptionimg) {
                    if (val5.skuColorValue) {
                      imageForSwatch = "color";
                      aliexpressOptions[ind5] = {
                        name: val5.skuColorValue,
                        optionid: val5.propertyValueId,
                        img: tempswatchoptionimg
                      };
                    } else {
                      imageForSwatch = "text";
                    }
                  } else {
                    imageForSwatch = "image";
                  }

                  superAttributes[ind4] = {
                    attr_id: val4.skuPropertyId,
                    swatch_type: imageForSwatch,
                    title: val4.skuPropertyName + ":",
                    value: aliexpressOptions
                  };
                });
              });
              (review_url =
                "//feedback.aliexpress.com/display/productEvaluation.htm?v=2&productId=" +
                productData.feedbackModule.productId +
                "&ownerMemberId=" +
                productData.feedbackModule.sellerAdminSeq),
                (review_count = 0);
              if (
                $("body").find(
                  'span.product-reviewer-reviews[itemprop="reviewCount"]'
                ).length > 0
              ) {
                review_count = parseInt(
                  $("body")
                    .find(
                      'span.product-reviewer-reviews[itemprop="reviewCount"]'
                    )
                    .text()
                );
              } else {
                try {
                  review_count =
                    productData.titleModule.feedbackRating.totalValidNum;
                } catch (error) {
                  review_count = 0;
                }
              }
              description_url = productData.descriptionModule.descriptionUrl;
              hideLoader();
              resolve(true);
            } else {
              hideLoader();
              reject(
                "Warning: There is some error to fetch product data, Please try it again!"
              );
            }
          }
        }
      });
    });
  };

  var makeCombination = function(html, comb, comb_array) {
    var notApplicable = false;
    var comb_text = "";
    var assImg = "";

    $.each(comb_array, function(i, v) {
      if (
        $("a[data-sku-id='" + v + "']")
          .parent()
          .hasClass("active")
      ) {
        if ($("a[data-sku-id='" + v + "']")[0] != undefined) {
          $("a[data-sku-id='" + v + "']")[0].click();
        }
      }

      if (
        !$("a[data-sku-id='" + v + "']")
          .parent()
          .hasClass("disabled")
      ) {
        var name = $(html)
          .find("a[data-sku-id='" + v + "']")
          .children("span")
          .text();
        var currAssImg = $(html)
          .find("a[data-sku-id='" + v + "']")
          .children("img")
          .attr("src");

        if (currAssImg != undefined) {
          assImg = currAssImg.replace("_50x50.jpg", "");
        }

        if (name == "") {
          name = $(html)
            .find("a[data-sku-id='" + v + "']")
            .attr("title");
        }

        comb_text += "+" + name;
        if ($("a[data-sku-id='" + v + "']")[0] != undefined) {
          $("a[data-sku-id='" + v + "']")[0].click();
        }
      } else {
        notApplicable = true;

        return false;
      }
    });

    if (!notApplicable) {
      // var qty = $(document)
      //   .find("em[data-role='stock-num']")
      //   .text()
      //   .split(" ")[0];
      var qty = tempQuantity;
      if ($(document).find("#j-multi-currency-price").length > 0) {
        customOption[comb] = {
          comb: comb,
          price: $(document)
            .find("#j-multi-currency-price")
            .text(),
          text: comb_text.slice(1),
          img: assImg,
          qty: qty
        };
      } else if ($(document).find("#j-sku-discount-price").length > 0) {
        customOption[comb] = {
          comb: comb,
          price: $(document)
            .find("#j-sku-discount-price")
            .text(),
          text: comb_text.slice(1),
          img: assImg,
          qty: qty
        };
      } else if ($(document).find("#j-sku-price").length > 0) {
        customOption[comb] = {
          comb: comb,
          price: $(document)
            .find("#j-sku-price")
            .text(),
          text: comb_text.slice(1),
          img: assImg,
          qty: qty
        };
      } else if ($(html).find("#j-sku-price").length > 0) {
        customOption[comb] = {
          comb: comb,
          price: $(html)
            .find("#j-sku-price")
            .text(),
          text: comb_text.slice(1),
          img: assImg,
          qty: qty
        };
      } else {
        customOption[comb] = {
          comb: comb,
          price: $(html)
            .find("#j-sku-discount-price")
            .text(),
          text: comb_text.slice(1),
          img: assImg,
          qty: qty
        };
      }
    }
  };

  var allPossibleCases = function(arr) {
    if (arr.length == 1) {
      return arr[0];
    } else {
      var result = [];
      var allCasesOfRest = allPossibleCases(arr.slice(1));

      for (var i = 0; i < allCasesOfRest.length; i++) {
        for (var j = 0; j < arr[0].length; j++) {
          result.push(arr[0][j] + "_" + allCasesOfRest[i]);
        }
      }

      return result;
    }
  };

  var productImport = function() {
    if ($("#productName").val() != undefined) {
      product_name = $("#productName").val();
    } else {
      product_name = "";
    }

    product_qty = $(document)
      .find(".product-quantity-tip")
      .text()
      .split(" ")[0];

    if ($("#productPrice").val() != undefined) {
      price = $("#productPrice").val();
    } else {
      price = "";
    }

    review_type = 2;
    custom_review_count = 0;

    if ($("input[type='radio'][name='reviews']:checked").val() != undefined) {
      review_type = $("input[type='radio'][name='reviews']:checked").val();
    }

    if (review_type == 3) {
      custom_review_count = $("#custom-review").val();
    }

    if ($("#productMetaTitle").val() != undefined) {
      product_meta_title = $("#productMetaTitle").val();
    } else {
      product_meta_title = "";
    }

    if ($("#productMetaDesc").val() != undefined) {
      product_meta_desc = $("#productMetaDesc").val();
    } else {
      product_meta_desc = "";
    }

    if ($("#productMetaKey").val() != undefined) {
      product_meta_keywords = $("#productMetaKey").val();
    } else {
      product_meta_keywords = "";
    }

    if ($(".wk-image").length > 0) {
      $($("#wk-images").find(".wk-image")).each(function(i, v) {
        imageFinalArr[i] = $(v)
          .find("img")
          .attr("src")
          .replace("https://", "");
      });
    }

    checked_swatch = [];
    if ($(".swatch-box").length > 0) {
      $("input:checkbox[class=swatch-box]:checked").each(function(i) {
        checked_swatch[i] = $(this).val();
      });
    }

    var updatedCustomOption = [],
      i = 0;
    $.each(customOption, function(index, value) {
      if (value.comb == "") {
        updatedPrice = $("#productPrice").val();
      } else {
        // key = parseInt(index);
        var updatedPrice = $(".block-input")
          .find("#" + index)
          .val();
      }
      if (value.qty > 0) {
        updatedCustomOption[i] = {
          comb: value.comb,
          price: updatedPrice,
          text: value.text,
          img: value.img.replace("https://", ""),
          qty: value.qty
        };
        i++;
      }
    });

    addProductGeneral()
      .then(function(product_id) {
        showLoader();
        removeWarning();
        setAlert(
          "success",
          "Product variations are importing. Please wait for some time as it takes time."
        );

        $.when(addProductOption(product_id, updatedCustomOption))
          .then(function(response) {
            removeWarning();
            setAlert(
              "success",
              "Product reviews are importing. Please wait for some time as it takes time."
            );

            addProductReview(product_id)
              .then(function(response) {
                $("#temp-product-edit-submit").attr(
                  "id",
                  "product-edit-submit"
                );
                $("#product-edit-submit").prop("disabled", false);

                setAlert("success", "Product has been successfully imported");
                removeWarning();

                hideLoader();
                $(document)
                  .find("#product-edit-modal")
                  .hide();
              })
              .catch(function(response) {
                $("#temp-product-edit-submit").attr(
                  "id",
                  "product-edit-submit"
                );
                $("#product-edit-submit").prop("disabled", false);

                setAlert("danger", response);
                hideLoader();
                removeWarning();
              });
          })
          .catch(function(response) {
            $("#temp-product-edit-submit").attr("id", "product-edit-submit");
            $("#product-edit-submit").prop("disabled", false);

            setAlert("danger", response);
            hideLoader();
            removeWarning();
          });
      })
      .catch(function(response) {
        $("#temp-product-edit-submit").attr("id", "product-edit-submit");
        $("#product-edit-submit").prop("disabled", false);

        setAlert("danger", response);
        hideLoader();
        removeWarning();
      });
  };

  var checkAttribute = function() {
    return new Promise(function(resolve, reject) {
      superAttrDetail = [];
      $.ajax({
        url: url + "dropship/aliexpress/import-super-attributes",
        data: {
          super_attributes: superAttributes
        },
        dataType: "jsonp",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response.success) {
            superAttrDetail = response.data;

            setAlert("success", "Product details has been fetched.");
            removeWarning();
            resolve(true);
          } else {
            setAlert("success", "Product details has been fetched.");
            hideLoader();
            resolve(true);
          }
        },

        error: function(xhr, ajaxOptions, thrownError) {
          isAuthenticated = false;
          reject(
            "Warning: There is some error to fetch product data, Please try it again!"
          );
        }
      });
    });
  };

  var addProductGeneral = function() {
    if (superAttributes.length > 0) {
      price = 0;
    }

    return new Promise(function(resolve, reject) {
      $.ajax({
        url: url + "dropship/aliexpress/import-product",
        data: {
          name: product_name,
          qty: product_qty,
          id: product_id,
          url: product_url.replace("https://", ""),
          price: price,
          meta_title: product_meta_title,
          meta_description: product_meta_desc,
          meta_keywords: product_meta_keywords,
          currency: currency,
          image_thumbnails: imageFinalArr,
          description_url: description_url.replace("https://", ""),
          super_attributes: superAttributes,
          swatches: checked_swatch
        },
        dataType: "jsonp",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response.success) {
            resolve(response.product_id);
          } else {
            isAuthenticated = false;
            reject(response.message);
          }
        },

        error: function(xhr, ajaxOptions, thrownError) {
          isAuthenticated = false;

          reject(
            "Warning: Product could not be imported successfully and next process like variations and reviews could not be imported, Please try it again!"
          );
        }
      });
    });
  };

  var addProductOption = function(product_id, updatedCustomOption) {
    return new Promise(function(resolve, reject) {
      var length = updatedCustomOption.length;

      if (length === 0) {
        resolve(true);
      } else {
        var options = updatedCustomOption.shift();
        if (options.comb != "") {
          addingProductOption(product_id, options)
            .then(function(response) {
              addProductOption(product_id, updatedCustomOption)
                .then(function(response) {
                  resolve(true);
                })
                .catch(function(response) {
                  $("#temp-product-edit-submit").attr(
                    "id",
                    "product-edit-submit"
                  );
                  $("#product-edit-submit").prop("disabled", false);

                  setAlert("danger", response);
                  hideLoader();
                  removeWarning();
                });
            })
            .catch(function(response) {
              reject(response);
            });
        } else {
          resolve(true);
        }
      }
    });
  };

  var addingProductOption = function(product_id, combination) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: url + "dropship/aliexpress/import-variation",
        data: {
          product_id: product_id,
          currency: currency,
          custom_option: combination
        },
        dataType: "jsonp",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          if (response.success) {
            resolve(true);
          } else {
            isAuthenticated = false;

            reject(
              "Warning: Product's variations could not be imported successfully and next process like attributes and reviews could not be imported, Please try it again!"
            );
          }
        },
        error: function(xhr, ajaxOptions, thrownError) {
          isAuthenticated = false;

          reject(
            "Warning: Product's variations could not be imported successfully and next process like attributes and reviews could not be imported, Please try it again!"
          );
        }
      });
    });
  };

  var addProductReview = function(product_id) {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: url + "dropship/aliexpress/import-reviews",
        data: {
          product_id: product_id,
          review_url: review_url,
          review_type: review_type,
          custom_review_count: custom_review_count
        },
        dataType: "jsonp",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();
          if (response.success) {
            resolve(true);
          } else {
            isAuthenticated = false;

            reject(
              "Warning: Product's review could not be imported successfully, Please try it again!"
            );
          }
        },

        error: function(xhr, ajaxOptions, thrownError) {
          isAuthenticated = false;

          reject(
            "Warning: Product's review could not be imported successfully, Please try it again!"
          );
        }
      });
    });
  };

  var urlExist = function() {
    return new Promise(function(resolve, reject) {
      if (url != undefined) {
        validateUrl()
          .then(function(response) {
            resolve(true);
          })
          .catch(function(response) {
            $(".request-modal").show();
            hideLoader();
            setAlert("danger", response);
            removeWarning();
          });
      } else {
        $(".request-modal").show();
        reject(
          "Error: Domain issue, please provide your store url to export products and process your orders"
        );
      }
    });
  };

  var authenticate = function() {
    return new Promise(function(resolve, reject) {
      if (
        username == undefined ||
        token == undefined ||
        username == "" ||
        token == ""
      ) {
        $(".login-modal").show();
        reject(
          "Warning: Authentication issue, please provide credentials again and authenticate!"
        );
      } else {
        $.ajax({
          url:
            url +
            "dropship/aliexpress/authenticate-user?username=" +
            username +
            "&token=" +
            token,
          dataType: "jsonp",
          jsonp: "callback",

          beforeSend: function() {
            showLoader();
          },

          success: function(response) {
            hideLoader();

            if (response.success) {
              $(".login-modal").hide();
              resolve("Success: Authenticated successfully!");
            } else {
              $(".login-modal").show();
              reject("Error: Authentication failed, try again!");
            }
          }
        });
      }
    });
  };

  var validateUrl = function() {
    return new Promise(function(resolve, reject) {
      if (url == undefined || url == "") {
        reject("Warning: Authentication issue, please provide store url!");
      } else {
        $.ajax({
          url: url + "dropship/aliexpress/validate-url",
          dataType: "jsonp",
          jsonp: "callback",

          beforeSend: function() {
            showLoader();
          },

          success: function(response) {
            hideLoader();

            if (response.success) {
              resolve("Success: Store Url Validate Successfully!!");
            }
          },

          error: function(response) {
            reject("Error: Url Validation failed, try again!");
          }
        });
      }
    });
  };

  var editProductModal = function() {
    $("#product-edit-modal").remove();
    $("body").prepend(modalEditProduct);
    $("#productName").val(product_name);
    $("#productMetaTitle").val(product_meta_title);
    $("#productMetaDesc").val(product_meta_desc);
    $("#productMetaKey").val(product_meta_keywords);

    if (review_count) {
      $(".review-label").text("Import Reviews Out of " + review_count);
      $(".reviews-input-div").show();
    }

    if (imageThumbArr && imageThumbArr.length > 0) {
      var imagesHtml = "";

      imagesHtml +=
        '<div class="input-block"><div class="input-label"><label>Images</label></div><div class="block-input"><div id="wk-images">';
      $.each(imageThumbArr, function(index, value) {
        imagesHtml +=
          '<div class="wk-image"><div class="wk-delete-img">X</div><img src="' +
          value +
          '"></div>';
      });
      imagesHtml += "</div></div></div>";

      $(document)
        .find("#product-edit-modal .modal-body")
        .append(imagesHtml);
    }

    var oldAttr = "";
    var newAttr = "";

    if (superAttrDetail && !$.isEmptyObject(superAttrDetail)) {
      $.each(superAttrDetail, function(index, value) {
        if (value.status === 1) {
          oldAttr += value.title + ",";
        } else {
          newAttr +=
            '<div style="display:inline-block;width: 33%;margin-left:5px;">' +
            value.title +
            '</div><div class="input-label" style="width: 50%;"><input class="swatch-box" type="checkbox" name="swatch" value="' +
            value.title +
            '"></div>';
        }
      });
    }

    if (oldAttr.length > 1) {
      var superAttrOldHtml = "";
      superAttrOldHtml +=
        '<div class="input-block"><div class="input-label" style="width: 32%;"><label>Already Created Attributes</label></div><div class="input-label" style="width: 50%;"><label class="sub-label">' +
        oldAttr.substring(0, oldAttr.length - 1) +
        "</label></div></div>";
      $(document)
        .find("#product-edit-modal .modal-body")
        .append(superAttrOldHtml);
    }

    if (newAttr.length > 1) {
      var superAttrHtml = "";
      superAttrHtml +=
        '<div class="input-block"><div class="input-label" style="width: 32%;"><label>New Attributes</label></div><div class="input-label" style="width: 50%;"><label>Created As Swatch</label></div>' +
        newAttr +
        "</div>";
      $(document)
        .find("#product-edit-modal .modal-body")
        .append(superAttrHtml);
    }

    if (customOption && !$.isEmptyObject(customOption)) {
      var variationHtml = "";
      variationHtml +=
        '<div class="input-block"><div class="input-label"><label>Variations</label></div><div class="block-input" style="overflow-y: auto;height: 300px;">';
      $.each(customOption, function(index, value) {
        if (value.qty > 0 && value.comb != "") {
          variationHtml +=
            '<div class="input-block"><div class="input-label"><label class="sub-label">' +
            value.text +
            '</label></div><div class="block-input"><div class="input-label"><label class="sub-label"></label></div><input type="text" class="productVariation" id="' +
            index +
            '" value="' +
            value.price +
            '"></div></div>';
        }

        if (value.comb == "") {
          // price
          $("#productPrice").val(price);
        } else {
          price = 0;
          $("#productPrice").val(price);
        }
      });

      variationHtml += "</div></div>";

      $(document)
        .find("#product-edit-modal .modal-body")
        .append(variationHtml);
    }

    $("#product-edit-modal").show();
  };

  var addToCart = function() {
    return new Promise(function(resolve, reject) {
      let exist;
      exist = findElementByClass("ui-window-transition");
      if (
        exist.length == 1 ||
        findElementByClass("addcart-result").length == 1
      ) {
        resolve(true);
      } else {
        setTimeout(function() {
          if (
            findElementByClass("ui-window-transition").length == 1 ||
            findElementByClass("addcart-result").length == 1
          ) {
            resolve(true);
          } else {
            reject(
              "There is some issue, please refresh the page to try again!"
            );
          }
        }, 2000);
      }
    });
  };

  var functionCheckbox = function(event) {
    switch (event) {
      case "epacket":
        if (localStorage.epacket == "true") {
          $(".wk_epacket_active").show();
        } else {
          $(".wk_epacket_active").hide();
        }

        if (
          localStorage.epacket != undefined &&
          localStorage.epacket == "true"
        ) {
          if (localStorage.hide_product_noepacket == "true") {
            $(".list-item:not(:has(.wk_epacket_active))").addClass(
              "wk_epacket_opacity"
            );
          } else {
            $(".list-item:not(:has(.wk_epacket_active))").removeClass(
              "wk_epacket_opacity"
            );
          }
        }

        break;

      case "hide_product_noepacket":
        if (
          localStorage.epacket != undefined &&
          localStorage.epacket == "true"
        ) {
          if (localStorage.hide_product_noepacket == "true") {
            $(".list-item:not(:has(.wk_epacket_active))").addClass(
              "wk_epacket_opacity"
            );
          } else {
            $(".list-item:not(:has(.wk_epacket_active))").removeClass(
              "wk_epacket_opacity"
            );
          }
        }
        break;
      default:
    }
  };

  var orderPlace = function(data) {
    var url;

    if (
      localStorage.aliexpress_import_url != undefined &&
      localStorage.aliexpress_import_url
    ) {
      url = localStorage.aliexpress_import_url;
    } else if (localStorage.wk_url != undefined && localStorage.wk_url) {
      url = localStorage.wk_url;
    }

    if (url) {
      $.ajax({
        url: url + "/dropship/aliexpress/place-order",
        data: { order_id: data.order_id },
        dataType: "jsonp",
        jsonp: "callback",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response["success"]) {
            setAlert("success", response["message"]);
            removeWarning();
            orderList(url);
          } else {
            setAlert("danger", response["message"]);
            removeWarning();
          }
        },

        error: function(xhr, ajaxOptions, thrownError) {
          hideLoader();
          setAlert(
            "danger",
            "Authentication issue, please provide valid store URL !"
          );
          removeWarning();
        }
      });
    }
  };

  var orderList = function(url) {
    if (url) {
      $.ajax({
        url: url + "dropship/aliexpress/orders",
        dataType: "jsonp",
        jsonp: "callback",

        success: function(response) {
          localStorage.aliexpress_order_list = response.orders;
        },

        error: function(xhr, ajaxOptions, thrownError) {
          delete localStorage.aliexpress_order_list;
        }
      });
    }
  };

  function importAddToStoreButton(self) {
    price = $(self)
      .parents(".img")
      .nextAll(".info")
      .children(".price-m")
      .children(".value")
      .text()
      .replace(
        /[ABCDEFGHIJKLMNOPQRSTUVWXYZ₩SEK¥RрубCHFNZSGCLP`TL~!@#$%грн^￡€&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi,
        ""
      );

    image = $(self)
      .parent(".wk_dropshipper")
      .next(".pic")
      .children("a")
      .children(".picCore")
      .attr("src")
      .replace(/^\/+|\/$/g, "");
    product_name = $(self)
      .parents(".img")
      .nextAll(".info")
      .children("h3")
      .children("a.product")
      .text();
    product_id = $(self)
      .parents(".img")
      .nextAll(".info-more")
      .children(".atc-product-id")
      .val();
    currency = $(".currency").text();
    urlExist()
      .then(function(response) {
        return authenticate()
          .then(function(response) {
            setAlert("success", response);
            removeWarning();

            return custAttrImport(product_url).then(function(response) {
              return checkAttribute().then(function(response) {
                editProductModal();
              });
            });
          })
          .catch(function(response) {
            hideLoader();
            setAlert("danger", response);
            removeWarning();
          });
      })
      .catch(function(response) {
        hideLoader();
        setAlert("danger", response);
        removeWarning();
      });
  }

  function importAddToStoreButtonList(self) {
    price = $(self)
      .parents(".list-item")
      .children(".right-block")
      .find(".info")
      .children(".price-m")
      .children(".value")
      .text()
      .replace(
        /[ABCDEFGHIJKLMNOPQRSTUVWXYZ₩SEK¥RрубCHFNZSGCLP`TL~!@#$%грн^￡€&*()_|+\-=?;:'",<>\{\}\[\]\\\/]/gi,
        ""
      );

    image = $(self)
      .parent(".wk_dropshipper")
      .next(".img-container")
      .children(".img")
      .children("a")
      .children(".picCore")
      .attr("src")
      .replace(/^\/+|\/$/g, "");
    product_name = $(self)
      .parents(".list-item")
      .children(".right-block")
      .find(".detail")
      .children("h3")
      .children("a.product")
      .text();
    product_id = $(self)
      .parents(".list-item")
      .children(".right-block")
      .find(".infoprice")
      .children(".atc-product-id")
      .val();
    currency = $(".currency").text();

    urlExist()
      .then(function(response) {
        return authenticate()
          .then(function(response) {
            setAlert("success", response);
            removeWarning();

            return custAttrImport(product_url).then(function(response) {
              return checkAttribute().then(function(response) {
                editProductModal();
              });
            });
          })
          .catch(function(response) {
            hideLoader();
            setAlert("danger", response);
            removeWarning();
          });
      })
      .catch(function(response) {
        hideLoader();
        setAlert("danger", response);
        removeWarning();
      });
  }

  $(document).ready(function() {
    orderList(url);
    $("body").on("click", "#addToStoreButtonList", function(e) {
      e.preventDefault();
      product_url = $(this)
        .parent(".wk_dropshipper")
        .next(".img-container")
        .children(".img")
        .children("a")
        .attr("href");
      var self = this;
      $.ajax({
        url: product_url,

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response) {
            var parsedResponse = jQuery.parseHTML(response);
            var newDom = $("<div/>").append(parsedResponse);
            var canonicalUrl = $("link[rel=canonical]", newDom).attr("href");

            if (canonicalUrl && typeof canonicalUrl != "undefined") {
              product_url = canonicalUrl.substr(
                canonicalUrl.indexOf("https://")
              );
            }
          }
        },

        complete: function(data) {
          importAddToStoreButtonList(self);
        }
      });
    });

    $("body").on("click", "#addToStoreButton", function(e) {
      e.preventDefault();
      product_url =
        "https:" +
        $(this)
          .parent(".wk_dropshipper")
          .next(".pic")
          .children("a")
          .attr("href");
      var self = this;
      $.ajax({
        url: product_url,

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response) {
            var parsedResponse = jQuery.parseHTML(response);
            var newDom = $("<div/>").append(parsedResponse);
            var canonicalUrl = $("link[rel=canonical]", newDom).attr("href");

            if (canonicalUrl && typeof canonicalUrl != "undefined") {
              product_url = canonicalUrl.substr(
                canonicalUrl.indexOf("https://")
              );
            }
          }
        },

        complete: function(data) {
          importAddToStoreButton(self);
        }
      });
    });

    $("body").on("click", "#addToStoreButtonProduct", function(e) {
      e.preventDefault();
      var canonicalUrl = $("link[rel=canonical]").attr("href");
      if (canonicalUrl && typeof canonicalUrl != "undefined") {
        product_url = canonicalUrl.substr(canonicalUrl.indexOf("https://"));
      } else {
        product_url = document.URL;
      }

      if ($("body").find("[itemprop=price]").length > 0) {
        fetchPriceAliexpress = $("body")
          .find("[itemprop=price]")
          .last()
          .text();

        price = fetchPriceAliexpress.replace(/[^0-9. ]/g, "");
      } else if (
        $("body").find("[itemprop=lowPrice]").length > 0 &&
        $("body").find("[itemprop=highPrice]").length > 0
      ) {
        price =
          $("body")
            .find("[itemprop=lowPrice]")
            .last()
            .text() +
          " - " +
          $("body")
            .find("[itemprop=highPrice]")
            .last()
            .text();

        price = 0;
      }

      image = $("body")
        .find("[itemprop=image] img")
        .attr("src");

      product_name = $("body")
        .find("[itemprop=name]")
        .text();

      currency = $(".currency").text();

      urlExist()
        .then(function(response) {
          return authenticate()
            .then(function(response) {
              setAlert("success", response);
              removeWarning();
              return custAttrImport(product_url).then(function(response) {
                return checkReviews().then(function() {
                  return checkAttribute().then(function(response) {
                    editProductModal();
                  });
                });
              });
            })
            .catch(function(response) {
              hideLoader();
              setAlert("danger", response);
              removeWarning();
            });
        })
        .catch(function(response) {
          hideLoader();
          setAlert("danger", response);
          removeWarning();
        });
    });

    $("body").on("click", "#addToStoreButtonProductItem", function(e) {
      e.preventDefault();
      var canonicalUrl = $("link[rel=canonical]").attr("href");
      if (canonicalUrl && typeof canonicalUrl != "undefined") {
        product_url = canonicalUrl.substr(canonicalUrl.indexOf("https://"));
      } else {
        product_url = document.URL;
      }

      if ($("body").find("[itemprop=price]").length > 0) {
        fetchPriceAliexpress = $("body")
          .find("[itemprop=price]")
          .last()
          .text();

        price = fetchPriceAliexpress.replace(/[^0-9. ]/g, "");
      } else if (
        $("body").find("[itemprop=lowPrice]").length > 0 &&
        $("body").find("[itemprop=highPrice]").length > 0
      ) {
        price =
          $("body")
            .find("[itemprop=lowPrice]")
            .last()
            .text() +
          " - " +
          $("body")
            .find("[itemprop=highPrice]")
            .last()
            .text();

        price = 0;
      }

      image = $("body")
        .find("[itemprop=image] img")
        .attr("src");
      product_name = $("body")
        .find("[itemprop=name]")
        .text();
      currency = $(".currency").text();
      urlExist()
        .then(function(response) {
          return authenticate()
            .then(function(response) {
              setAlert("success", response);
              removeWarning();
              return custAttrImport(product_url).then(function(response) {
                return checkReviews().then(function() {
                  return checkAttribute().then(function(response) {
                    editProductModal();
                  });
                });
              });
            })
            .catch(function(response) {
              hideLoader();
              setAlert("danger", response);
              removeWarning();
            });
        })
        .catch(function(response) {
          hideLoader();
          setAlert("danger", response);
          removeWarning();
        });
    });

    $("body").on("click", "#login-submit", function() {
      username = $("#username").val();
      token = $("#token").val();

      authenticate()
        .then(function(response) {
          setAlert("success", response);
          removeWarning();

          localStorage.aliexpress_import_username = username;
          localStorage.aliexpress_import_token = token;
          location.reload();
        })
        .catch(function(response) {
          hideLoader();
          setAlert("danger", response);
          removeWarning();
        });
    });

    $("body").on("click", "#request-submit", function() {
      url = $("#url").val();

      if ($("#url").val() == "") {
        setAlert("danger", "Please fill the url!");
        removeWarning();
        return;
      } else if (url.indexOf("https://") != 0) {
        setAlert("danger", "Please enter secure url!");
        removeWarning();
        return;
      } else {
        try {
          new URL(url);

          validateUrl()
            .then(function(response) {
              localStorage.aliexpress_import_url = url;
              $(".request-modal").hide();
              $(".login-modal").show();
            })
            .catch(function(response) {
              setAlert("danger", response);
              hideLoader();
              removeWarning();
            });
        } catch (_) {
          hideLoader();
          setAlert("danger", "Given url is not valid!");
          removeWarning();
          return;
        }
      }
    });

    $("body").on("click", 'input:radio[name="reviews"]', function() {
      var radioVal = $(this).val();

      if (radioVal == 3) {
        $("#custom-review").show();
      } else {
        $("#custom-review").hide();
      }
    });

    var sku_attr = "";
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == "wk_order_id") {
        current_order_id = pair[1];
      }

      if (pair[0] == "wk_product_qty") {
        qty_ordered = pair[1];
      }

      if (pair[0] == "sku_attributes") {
        sku_attr = pair[1];
      }

      if (pair[0] == "wk_product_ids") {
        if (window.location.href.search("www.aliexpress.com/item/") == 8) {
          $("#wk_user_restrict").remove();
          $("body").prepend(
            '<div id="wk_user_restrict" style="display:block;"></div>'
          );
        }

        urlExist()
          .then(function(response) {
            return authenticate()
              .then(function(response) {
                qty_array = qty_ordered.split("_");

                if ($("#j-p-quantity-input").length) {
                  $("#j-p-quantity-input").val(qty_array[qty_array.length - 1]);
                  if (sku_attr != "") {
                    sku_attr_array = sku_attr.split("_");
                    curr_sku_attr = sku_attr_array[
                      sku_attr_array.length - 1
                    ].split("+");
                    $.each(curr_sku_attr, function(index, value) {
                      if (value != 0) {
                        $("a[data-sku-id='" + value + "']")[0].click();
                      }
                    });
                  }
                  $("a#j-add-cart-btn")[0].click();
                } else {
                  $(".product-quantity input").val(
                    qty_array[qty_array.length - 1]
                  );
                  if (sku_attr != "") {
                    sku_attr_array = sku_attr.split("_");
                    curr_sku_attr = sku_attr_array[
                      sku_attr_array.length - 1
                    ].split("+");

                    $.each(curr_sku_attr, function(index, value) {
                      if (value != 0) {
                        $.each(
                          window.runParams.data.skuModule
                            .productSKUPropertyList,
                          function(ind1, val1) {
                            $.each(val1.skuPropertyValues, function(
                              ind2,
                              val2
                            ) {
                              if (val2.propertyValueId == parseInt(value)) {
                                if (
                                  val1.isShowTypeColor &&
                                  val1.skuPropertyName.toLowerCase() == "color"
                                ) {
                                  // this block is for swatch images
                                  if (
                                    !$("body")
                                      .find(
                                        '.product-sku .sku-property-item [src="' +
                                          val2.skuPropertyImageSummPath + '_.webp' +
                                          '"]'
                                      )
                                      .closest(".sku-property-item")
                                      .hasClass("selected")
                                  ) {
                                    $("body")
                                      .find(
                                        '.product-sku .sku-property-item [src="' +
                                          val2.skuPropertyImageSummPath + '_.webp' +
                                          '"]'
                                      )
                                      .click();
                                  }
                                } else if (
                                  val1.isShowTypeColor == false &&
                                  val1.skuPropertyName.toLowerCase() == "color"
                                ) {
                                  if (val1.skuPropertyValues[ind2]['skuPropertyImageSummPath']) {
                                       // this block is for swatch images
                                  if (
                                    !$("body")
                                      .find(
                                        '.product-sku .sku-property-item [src="' +
                                          val2.skuPropertyImageSummPath + '_.webp' +
                                          '"]'
                                      )
                                      .closest(".sku-property-item")
                                      .hasClass("selected")
                                  ) {
                                    $("body")
                                      .find(
                                        '.product-sku .sku-property-item [src="' +
                                          val2.skuPropertyImageSummPath + '_.webp' +
                                          '"]'
                                      )
                                      .click();
                                  }
                                  } else {
                                      // this block is for swatch text as Color
                                    $.each(
                                      $("body").find(
                                        ".product-sku .sku-property-item .sku-property-text span"
                                      ),
                                      function(ind3, val3) {
                                        if (
                                          $(val3).text() ==
                                            val2.propertyValueDisplayName ||
                                          (val2.propertyValueDisplayName ==
                                            undefined &&
                                            $(val3).text() ==
                                              val2.propertyValueName)
                                        ) {
                                          if (
                                            !$(val3)
                                              .closest(".sku-property-item")
                                              .hasClass("selected")
                                          ) {
                                            $(val3).click();
                                          }
                                        }
                                        else if (
                                          $(val3).attr('title') ==
                                            val2.propertyValueDefinitionName ||
                                          (val2.propertyValueDefinitionName ==
                                            undefined)
                                        ) {
                                          if (
                                            !$(val3)
                                              .closest(".sku-property-item")
                                              .hasClass("selected")
                                          ) {
                                            $(val3).click();
                                          }
                                        }
                                      }
                                    );
                                    }
                                } else {
                                  // this block is for swatch as text like ship From
                                  $.each(
                                    $("body").find(
                                      ".product-sku .sku-property-item .sku-property-text span"
                                    ),
                                    function(ind3, val3) {
                                      if (
                                        $(val3).text() ==
                                          val2.propertyValueDisplayName ||
                                        (val2.propertyValueDisplayName ==
                                          undefined &&
                                          $(val3).text() ==
                                            val2.propertyValueName)
                                      ) {
                                        if (
                                          !$(val3)
                                            .closest(".sku-property-item")
                                            .hasClass("selected")
                                        ) {
                                          $(val3).click();
                                        }
                                      }
                                    }
                                  );
                                }

                                if (
                                  val1.isShowTypeColor &&
                                  val1.skuPropertyName.toLowerCase() == "color"
                                ) {
                                  if (
                                    !$("body")
                                      .find(
                                        ".product-sku .sku-property-item .sku-property-color span.sku-color-" +
                                          val2.propertyValueId +
                                          ""
                                      )
                                      .closest(".sku-property-item")
                                      .hasClass("selected")
                                  ) {
                                    $("body")
                                      .find(
                                        ".product-sku .sku-property-item .sku-property-color .sku-color-" +
                                          val2.propertyValueId +
                                          ""
                                      )
                                      .click();
                                  }
                                }
                              }
                            });
                          }
                        );
                      }
                    });
                  }
                  $(".fixed-add-to-cart")[0].click();
                }

                // $("a#j-add-cart-btn")[0].click(); change in line
                addToCart()
                  .then(function() {
                    product_ids = pair[1];
                    product_array = product_ids.split("_");
                    // safecode
                    if (product_array.length > 1) {
                      removeQtyOrdered = qty_array.pop();
                      newqty_ordered = qty_ordered.replace(
                        "_" + removeQtyOrdered,
                        ""
                      );
                      removeProductId = product_array.pop();
                      product_idss = product_ids.replace(
                        "_" + removeProductId,
                        ""
                      );
                      href = href.replace(
                        removeProductId + ".html",
                        product_idss.split("_").pop() + ".html"
                      );
                      customUrl = href.replace(product_ids, product_idss);
                      customUrl = customUrl.replace(
                        qty_ordered,
                        newqty_ordered
                      );

                      if (sku_attr != "") {
                        removeAttrSku = sku_attr_array.pop();
                        new_sku_attr = sku_attr.replace(
                          "_" + removeAttrSku,
                          ""
                        );
                        customUrl = customUrl.replace(sku_attr, new_sku_attr);
                      }

                      location = customUrl;
                    } else {
                      location =
                        "https://shoppingcart.aliexpress.com/shopcart/shopcartDetail.htm?wk_order_id=" +
                        current_order_id +
                        "&wk_url=" +
                        url;
                    }
                  })
                  .catch(function(response) {
                    hideLoader();
                    setAlert("danger", response);
                    removeWarning();
                  });
              })
              .catch(function(response) {
                hideLoader();
                setAlert("danger", response);
                removeWarning();
              });
          })
          .catch(function(response) {
            hideLoader();
            setAlert("danger", response);
            removeWarning();
          });
      }
    }

    if (
      host == "shoppingcart.aliexpress.com" &&
      pathname == "/shopcart/shopcartDetail.htm"
    ) {
      var vars = query.split("&");

      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");

        if (pair[0] == "wk_url") {
          localStorage.wk_url = pair[1];
        }

        if (pair[0] == "wk_order_id") {
          $("#wk_user_restrict").remove();
          $("body").prepend(
            '<div id="wk_user_restrict" style="display:block;"></div>'
          );
          localStorage.wk_order_id = pair[1];
          if ($(".buy-now").length) {
            $(".buy-now").trigger("click");
          } else {
            $(".select-all-container label.select-all").trigger("click");
            setTimeout(function() {
              $("#checkout-button").trigger("click");
              setTimeout(function() {
                let templocation =
                  $("#poplay-order").attr("src") +
                  "&wk_order_id=" +
                  localStorage.wk_order_id +
                  "&wk_url=" +
                  localStorage.wk_url;
                location = templocation.replace("&viewMode=mini", "");
              }, 2000);
            }, 2000);
          }
        }
      }
    }

    if (
      localStorage.wk_order_id != undefined &&
      localStorage.wk_order_id != 0 &&
      host == "shoppingcart.aliexpress.com" &&
      pathname == "/order/confirm_order.htm"
    ) {
      $("body").prepend(
        '<div id="wk_user_restrict" style="display:block;"></div>'
      );
      $(".sa-add-a-new-address")[0].click();

      $.ajax({
        url: localStorage.wk_url + "dropship/aliexpress/order-details",
        data: {
          order_id: localStorage.wk_order_id
        },
        dataType: "jsonp",

        beforeSend: function() {
          showLoader();
        },

        success: function(response) {
          hideLoader();

          if (response) {
            $('input[name="email"]').val(response.contact_email);
            $('input[name="contactPerson"]').val(response.contact_name);
            $('input[name="address"]').val(response.shipping_address_1);
            $('input[name="address2"]').val(response.shipping_address_2);
            $('input[name="city"]').val(response.shipping_city);
            $('input[name="mobileNo"]').val(response.telephone);
            $('select[name="country"]')
              .eq(0)
              .removeAttr("selected");
            $(
              'select[name="country"] option[value="' +
                response.iso_code_2 +
                '"]'
            ).attr("selected", true);
            $(".sa-country").trigger("change");

            if (response.zipcode) {
              $('input[name="zip"]').val(response.zipcode);
            } else {
              $(".sa-no-zip-code")
                .children('input[type="checkbox"]')
                .prop("checked", true);
            }

            isNeedState = $('input[name="province"]').css("display");

            if (isNeedState == "none") {
              $('input[name="province"]')
                .next('select option[value="' + response.state + '"]')
                .attr("selected", true);
              $('input[name="province"]').val(response.state);
            } else {
              $('input[name="province"]').val(response.state);
            }

            $(".sa-confirm")[0].click();

            localStorage.wk_order_id = 0;

            setTimeout(function() {
              $("#wk_user_restrict").remove();
            }, 2000);

            $("body")
              .find(".p-message > textarea.message-text")
              .text("Do not put any info.");
          }
        }
      });
    }

    if (
      localStorage.wk_order_id != undefined &&
      localStorage.wk_order_id != 0 &&
      host == "shoppingcart.aliexpress.com" &&
      pathname == "/orders.htm"
    ) {
      if ($(".address-list-opt button").length) {
        $(".address-list-opt button")[0].click();
      }

      var storeURL = localStorage.wk_url.replace(/.$/,"")

      $.ajax({
        url: storeURL + "/dropship/aliexpress/order-details",
        data: {
          order_id: localStorage.wk_order_id
        },
        dataType: "jsonp",
        beforeSend: function() {
          showLoader();
        },
        success: function(response) {
          hideLoader();
          if (response && response.success) {
            showCustomerAddress(response);
          }

          localStorage.wk_order_id = 0;
        }
      });
    }
    function showCustomerAddress(data) {
      let html = "";
      let tempdata = {
        "Name: ": data.contact_name,
        "Address: ": data.shipping_address_1,
        "Address 2: ": data.shipping_address_2,
        "City: ": data.shipping_city,
        "State: ": data.state,
        "Country: ": data.country,
        "Zip Code: ": data.zipcode,
        "Mobile: ": data.telephone
      };
      html +=
        '<div class="wk-customer-address-detail-container" style="position:fixed;right: 0;top: 100px;border: 2px solid #22a1f6;background:#ffffff;padding: 0 20px 20px;z-index: 5;border-radius: 3px;">' +
        '<div class="wk-customer-address-detail">' +
        '<span id="wk-customer-address-detail-close" style=" height: 20px; width: 20px; position: absolute; top: 0; right: 0; text-align: center; color: white; background: #f94747; font-weight: bold; cursor: pointer; ">x</span>' +
        "<h4>Customer's Address</h4>" +
        "<table>";
      $.each(tempdata, function(ind, val) {
        if (val && val != undefined) {
          html +=
            '<tr">' +
            '<td style="padding: 5px 5px 5px 0;"><b>' +
            ind +
            "</b></td>" +
            '<td style="padding:5px 0;">' +
            val +
            "</td>" +
            "</tr>";
        }
      });
      html += "</table>" + "</div>" + "</div>";
      $("body").append(html);
    }
    $("body").on("click", "#wk-customer-address-detail-close", function() {
      $(this)
        .closest(".wk-customer-address-detail-container")
        .hide();
    });

    if (
      localStorage.aliexpress_import_url != undefined &&
      localStorage.aliexpress_import_url != ""
    ) {
      $(".wk_dropshipper_remove").show();
    }

    $("body").on("click", "#flush-icon", function() {
      $(".request-modal").show();
      $("#url").val(localStorage.aliexpress_import_url);
    });

    $(document).on("click", "#cancel-product-edit-modal", function() {
      $("#wk_user_restrict").remove();
      $(document)
        .find("#product-edit-modal")
        .hide();
    });

    $("body").on("click", "#product-edit-submit", function() {
      $(this).prop("disabled", true);

      var wk_error = "";
      if ($("#productName").val() != undefined) {
        if (
          $("#productName").val().length < 3 ||
          $("#productName").val().length > 255
        ) {
          wk_error =
            "Product Name must be greater than 3 and less than 255 characters!";
        }
      } else {
        wk_error = "Product must be given";
      }

      if (
        $("#productPrice").val() == undefined ||
        !$.isNumeric($("#productPrice").val())
      ) {
        wk_error = "Product price should be a valid numeric value!";
      }

      if (
        $("#custom-review").val() != undefined &&
        $("input[type='radio'][name='reviews']:checked").val() == 3
      ) {
        if (
          parseInt($("#custom-review").val()) <= 0 ||
          parseInt($("#custom-review").val()) > parseInt(review_count)
        ) {
          wk_error =
            "Custom Review must be greater than 0 and less than total review!";
        }
      }

      if ($("#productMetaTitle").val() != undefined) {
        if (
          $("#productMetaTitle").val().length < 3 ||
          $("#productMetaTitle").val().length > 255
        ) {
          wk_error =
            "Meta Title must be greater than 3 and less than 255 characters!";
        }
      } else {
        wk_error = "Meta Title must be given";
      }

      if ($("#productMetaDesc").val() == undefined) {
        wk_error =
          "Meta Description must be greater than 3 and less than 255 characters!";
      }

      if ($("#productMetaKey").val() == undefined) {
        wk_error =
          "Meta Keywords must be greater than 3 and less than 255 characters!";
      }

      if (wk_error == "") {
        productImport();
      } else {
        setAlert("danger", wk_error);
        removeWarning();
        $(this).prop("disabled", false);
      }
    });
  });

  $(".atc-product-id").each(function(i, v) {
    var product_id = $(v).val();

    if (product_id) {
      $.ajax({
        url: "https://freight.aliexpress.com/ajaxFreightCalculateService.htm",
        data: { productid: product_id, country: "US" },
        dataType: "jsonp",

        success: function(response) {
          $(response.freight).each(function(i, v) {
            var node = $("[value=" + product_id + "]")
              .parents(".list-item")
              .removeClass("wk_epacket_opacity");

            $(node)
              .find(".wk-day")
              .text(v.processingTime + " Days");

            if (v.companyDisplayName == "ePacket") {
              var epacketPrice = "";
              if (v.status == "free") {
                epacketPrice = "Free";
              } else {
                epacketPrice = v.priceFormatStr;
              }

              if (localStorage.epacket != undefined) {
                if (localStorage.epacket == "true") {
                  if (v.status == "free") {
                    $(node)
                      .find(".wk_epacket_grid")
                      .addClass("wk_epacket_active")
                      .children("span")
                      .text("Free");
                    $(node)
                      .find(".wk_epacket_list")
                      .addClass("wk_epacket_active")
                      .children("span")
                      .text("Free");
                  } else {
                    $(node)
                      .find(".wk_epacket_grid")
                      .addClass("wk_epacket_active")
                      .children("span")
                      .text(v.priceFormatStr);
                    $(node)
                      .find(".wk_epacket_list")
                      .addClass("wk_epacket_active")
                      .children("span")
                      .text(v.priceFormatStr);
                  }
                } else {
                  $(node)
                    .find(".wk_epacket_grid")
                    .addClass("wk_epacket_active")
                    .hide();
                  $(node)
                    .find(".wk_epacket_list")
                    .addClass("wk_epacket_active")
                    .hide();
                }
              } else {
                $(node)
                  .find(".wk_epacket_grid")
                  .addClass("wk_epacket_active")
                  .children("span")
                  .text(epacketPrice);
                $(node)
                  .find(".wk_epacket_list")
                  .addClass("wk_epacket_active")
                  .children("span")
                  .text(epacketPrice);
              }

              return false;
            } else {
              if (
                localStorage.epacket != undefined &&
                localStorage.hide_product_noepacket != undefined &&
                localStorage.epacket == "true" &&
                localStorage.hide_product_noepacket == "true"
              ) {
                $("[value=" + product_id + "]")
                  .parents(".list-item:not(:has(.wk_epacket_active))")
                  .addClass("wk_epacket_opacity");
              }
            }
          });
        }
      });
    }
  });

  window.addEventListener(
    "message",
    function(event) {
      if (event.source != window) {
        return;
      }

      if (event.data.type) {
        switch (event.data.type) {
          case "clearLocalStorage":
            $("#product-edit-modal").hide();
            $(".login-modal").hide();
            $(".request-modal").show();
            break;

          case "orderPlace":
            orderPlace(event.data);
            break;

          case "functionCheckbox":
            localStorage[event.data.event] = event.data.cond;
            functionCheckbox(event.data.event);
            break;

          default:
        }
      }
    },
    false
  );
};
