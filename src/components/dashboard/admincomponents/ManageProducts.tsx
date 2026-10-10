/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import Loader from '@/components/common/Loader';
import CheckRoleAndLogout from '@/hooks/CheckRoleAndLogout';
import { useGetProfileQuery } from '@/redux/api/authApi';
import { useGetProductsQuery, useDeleteProductMutation, useApproveProductMutation } from '@/redux/api/productApi';
import { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit } from 'react-icons/ci';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { IoCheckmarkCircleOutline, IoEyeOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const ManageProducts = () => {
  CheckRoleAndLogout('admin');

  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery(undefined);
  const userProfileFromDb = profileData?.data;

  const [searchProductByTitle, setSearchProductByTitle] = useState<string>('');
  const [page, setPage] = useState<string>('1');
  const limit = '10';

  const allFilters = {
    page: page,
    limit: limit,
    searchTerm: searchProductByTitle,
    status: 'all',
  };

  const createQueryString = (obj: any) => {
    const keyValuePairs = [];
    for (const key in obj) {
      if (obj[key]) {
        keyValuePairs.push(
          encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
        );
      }
    }
    return keyValuePairs.join('&');
  };

  const [queryParams, setQueryParams] = useState(createQueryString(allFilters));

  useEffect(() => {
    if (searchProductByTitle !== '' && Number(page) > 1) {
      setPage('1');
    }
    setQueryParams(createQueryString({
      page,
      limit,
      searchTerm: searchProductByTitle,
      status: 'all',
    }));
  }, [page, limit, searchProductByTitle]);

  const { data: allProducts, isLoading: isProductsLoading } = useGetProductsQuery(queryParams);

  const totalItems = allProducts?.meta?.total || 0;
  const totalPages = Math.ceil(Number(totalItems) / Number(limit));

  const handlePageChange = (page: number) => {
    setPage(page.toString());
  };

  const [deleteProduct] = useDeleteProductMutation();
  const [approveProduct] = useApproveProductMutation();

  const handleApproveProduct = async (id: string) => {
    try {
      const response = await approveProduct(id).unwrap();
      if (response?.success) {
        toast.success('Product approved successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to approve product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const allow = window.confirm('Are you sure you want to delete this product?');
    if (!allow) return;

    try {
      const response = await deleteProduct(productId).unwrap();
      if (response?.success) {
        toast.success('Product deleted successfully');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to delete product');
    }
  };

  if (isProfileLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h3 className="text-center mt-10 lg:mt-14 text-2xl font-semibold text-dark">Manage Products</h3>
      <p className="text-center lg:mt-2 md:text-md lg:w-2/3 lg:mx-auto text-gray-600">
        Welcome, {userProfileFromDb?.name}! Here you can manage all products in the system.
      </p>

      <div className="lg:w-11/12 lg:mx-auto">
        <div className="flex flex-col space-y-3 lg:flex-row justify-between items-center mt-8">
          <Link to="/dashboard/admin/manage-products/add-product">
            <div className="bg-orange rounded-md px-4 py-2 cursor-pointer text-white hover:bg-orange-600 transition-colors duration-300 ease-in-out flex items-center space-x-2 mt-3 font-medium">
              <IoIosAddCircleOutline style={{ fontSize: '18px' }} />
              <span>Add Product</span>
            </div>
          </Link>

          <div className="relative w-full lg:w-1/3">
            <input
              type="search"
              className="text-sm rounded-lg w-full p-2.5 pl-4 focus:outline-none bg-gray-50 border border-gray-200 focus:ring-1 focus:ring-orange"
              placeholder="Search product by name..."
              value={searchProductByTitle}
              onChange={(e) => setSearchProductByTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-10 lg:mb-24 lg:mt-8 lg:shadow-md lg:rounded-md lg:py-5 lg:px-6 lg:pb-8 bg-white overflow-hidden">
          <div className="mt-8 lg:mt-2">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Product Name</th>
                    <th scope="col" className="px-6 py-3">Price</th>
                    <th scope="col" className="px-6 py-3">Vendor</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isProductsLoading ? (
                    <tr>
                      <td colSpan={4} className="py-20 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
                        </div>
                      </td>
                    </tr>
                  ) : allProducts?.data?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-red-400 font-semibold">
                        No Product Found
                      </td>
                    </tr>
                  ) : (
                    allProducts?.data?.map((product: any) => (
                      <tr className="bg-white border-b hover:bg-orange-50 transition-colors" key={product.id}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                          {product?.title}
                        </th>
                        <td className="px-6 py-4">${product?.price}</td>
                        <td className="px-6 py-4">{product?.vendor || 'Admin'}</td>
                        <td className={`px-6 py-4 font-semibold ${product?.status === 'APPROVED' ? 'text-green-500' : 'text-orange-500'}`}>
                          {product?.status}
                        </td>
                        <td className="px-6 py-4 flex space-x-4 justify-end items-center">
                          {product?.status === 'PENDING' && (
                            <button
                              className="text-xl text-green-500 hover:text-green-700 transition-colors"
                              title="Approve Product"
                              onClick={() => handleApproveProduct(product.id)}
                            >
                              <IoCheckmarkCircleOutline />
                            </button>
                          )}
                          <Link to={`/product/${product?.id}`} target="_blank">
                            <button className="text-xl text-bluish hover:text-blue-700 transition-colors" title="View Product">
                              <IoEyeOutline />
                            </button>
                          </Link>
                          <Link to={`/dashboard/admin/manage-products/update-product/${product.id}`}>
                            <button className="text-xl text-orange hover:text-orange-600 transition-colors" title="Update Product">
                              <CiEdit />
                            </button>
                          </Link>
                          <button
                            className="text-xl text-red-500 hover:text-red-700 transition-colors"
                            title="Delete Product"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <AiOutlineDelete />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              {!isProductsLoading && allProducts?.data?.length > 0 && (
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => handlePageChange(Number(page) - 1)}
                    disabled={Number(page) === 1}
                  >
                    Prev
                  </button>
                  <span className="px-3 py-1 text-gray-600 font-medium">Page {page} of {totalPages || 1}</span>
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50"
                    onClick={() => handlePageChange(Number(page) + 1)}
                    disabled={Number(page) === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageProducts;
