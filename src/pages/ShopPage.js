import React, { useEffect, useState } from "react";
import productApi from "../axios/productApi";
import { Link, useSearchParams } from "react-router-dom";
import ProductSideBar from "../components/ProductSideBar";
import Pagination from "../components/Pagination";
import ProductPreview from "../components/ProductPreview";

function ShopPage() {
  const [query] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);

  useEffect(() => {
    const getListProductHandle = async () => {
      const { data } = await productApi.getListProduct();
      const price = query.get("price");
      console.log("product", data);
      if (price !== "0" && price !== null) {
        const price1 = parseInt(price.split("-")[0]);
        const price2 = parseInt(price.split("-")[1]);
        const productFilter = data.data.filter(
          (item) => item.price >= price1 && item.price <= price2
        );
        setProducts(productFilter);
      } else {
        setProducts(data.data);
      }
    };
    getListProductHandle();

    // const productShow = products.filter()
  }, [query]);
  return (
    <div>
      {/* <!-- Breadcrumb Start --> */}
      <div className="container-fluid">
        <div className="row px-xl-5">
          <div className="col-12">
            <nav className="breadcrumb bg-light mb-30">
              <Link className="breadcrumb-item text-dark" href="#">
                Home
              </Link>
              <Link className="breadcrumb-item text-dark" href="#">
                Shop
              </Link>
              <span className="breadcrumb-item active">Shop List</span>
            </nav>
          </div>
        </div>
      </div>
      {/* <!-- Breadcrumb End --> */}
      <div className="container-fluid">
        <div className="row px-xl-5">
          <ProductSideBar />

          {/* <!-- Shop Product Start --> */}
          <div className="col-lg-9 col-md-8">
            <div className="row pb-3">
              <div className="col-12 pb-1">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <button className="btn btn-sm btn-light">
                      <i className="fa fa-th-large"></i>
                    </button>
                    <button className="btn btn-sm btn-light ml-2">
                      <i className="fa fa-bars"></i>
                    </button>
                  </div>
                  <div className="ml-2">
                    <div className="btn-group">
                      <button
                        type="button"
                        className="btn btn-sm btn-light dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Sorting
                      </button>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" href="#">
                          Latest
                        </Link>
                        <Link className="dropdown-item" href="#">
                          Popularity
                        </Link>
                        <Link className="dropdown-item" href="#">
                          Best Rating
                        </Link>
                      </div>
                    </div>
                    <div className="btn-group ml-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-light dropdown-toggle"
                        data-toggle="dropdown"
                      >
                        Showing
                      </button>
                      <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item" href="#">
                          10
                        </Link>
                        <Link className="dropdown-item" href="#">
                          20
                        </Link>
                        <Link className="dropdown-item" href="#">
                          30
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {currentItems &&
                currentItems.map((product) => (
                  <ProductPreview key={product._id} {...product} />
                ))}
              <Pagination
                itemsPerPage={12}
                items={products}
                setCurrentItems={setCurrentItems}
              />
            </div>
          </div>
          {/* <!-- Shop Product End --> */}
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
