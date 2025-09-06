import { useSelector } from "react-redux"
import { useYourOrderMutation } from "../Slice/API/tableApi"
import type { RootState } from "../store"
import { useEffect } from "react"

function YourOrder() {
  const [yourOrder, { data, error, isLoading }] = useYourOrderMutation()
  const tableInfo = useSelector((state: RootState) => state.auth.table)

  useEffect(() => {
    if (tableInfo?.table_id) {
      const fetchOrder = async () => {
        try {
          await yourOrder({ table_id: tableInfo.table_id }).unwrap()
        } catch (err) {
          console.error("Failed to fetch order:", err)
        }
      }
      fetchOrder()
    }
    // eslint-disable-next-line
  }, [tableInfo?.table_id, yourOrder])

  const handleRefreshOrder = async () => {
    if (tableInfo?.table_id) {
      try {
        await yourOrder({ table_id: tableInfo.table_id }).unwrap()
      } catch (err) {
        console.error("Failed to refresh order:", err)
      }
    }
  }

  // === Amount calculations (just for box display) ===
  const total = data?.data?.total || 0
  const discountPercent = data?.discount?.persent || 0
  const discountName = data?.discount?.name || null
  const discountAmount = total * (discountPercent / 100)
  const taxAmount = total * 0.001 // 0.1%
  const serviceCharge = total === 0 ? 0 : 2500

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Your Order</h2>
            {tableInfo?.table_id && (
              <button 
                onClick={handleRefreshOrder} 
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Refreshing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </div>
                )}
              </button>
            )}
          </div>
          {tableInfo && (
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-600">
                Current Table: <span className="font-semibold">{tableInfo.table_number || tableInfo.name}</span>
              </p>
              <p className="text-xs text-blue-500 mt-1">
                Table ID: {tableInfo.table_id} 
              </p>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && !data && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Loading Your Orders</h3>
            <p className="text-gray-600">Please wait while we fetch your order details...</p>
          </div>
        )}

        {/* Error handling */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">
                Error: {error.data?.message || "Failed to fetch order"}
              </p>
            </div>
            {tableInfo?.table_id && (
              <button  
                onClick={handleRefreshOrder}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Try again
              </button>
            )}
          </div>
        )}

        {/* Main Content */}
        {data && data.success && (
          <div className="space-y-6">

            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Customer Id: {data.data._id} 
                    </h3>
                    <p className="text-gray-600">Table ID: {data.data.table_id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders */}
            {data.data.tableOrders && data.data.tableOrders.length > 0 ? (
              <div className="space-y-4">
                {data.data.tableOrders.map((order, index) => (
                  <div key={order._id || index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h4 className="text-lg font-semibold text-gray-800">
                          Order #{index + 1}
                        </h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-gray-600">
                              {new Date(order.time).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-green-600 font-semibold">
                              {order.total} MMK
                            </span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <h5 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Order Items
                      </h5>
                      <div className="space-y-3">
                        {data.data.orderItems
                          .filter(item => item.order_id === order._id)
                          .map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            {/* Menu Item */}
                            {item.menuDetails && item.menuDetails.length > 0 && (
                              <>
                                <div className="flex items-center gap-3">
                                  {item.menuDetails[0].image && (
                                    <img 
                                      src={item.menuDetails[0].image} 
                                      alt={item.menuDetails[0].name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-800">{item.menuDetails[0].name}</p>
                                    <p className="text-sm text-gray-500">{item.menuDetails[0].type}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-800">{item.menuDetails[0].price} MMK</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </>
                            )}

                            {/* Set Item */}
                            {item.setDetails && item.setDetails.length > 0 && (
                              <>
                                <div className="flex items-center gap-3">
                                  {item.setDetails[0].image && (
                                    <img 
                                      src={item.setDetails[0].image} 
                                      alt={item.setDetails[0].name}
                                      className="w-12 h-12 rounded-lg object-cover"
                                    />
                                  )}
                                  <div>
                                    <p className="font-medium text-gray-800">{item.setDetails[0].name}</p>
                                    <p className="text-sm text-gray-500 bg-purple-100 text-purple-800 px-2 py-1 rounded-full inline-block">Set Menu</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold text-gray-800">{item.setDetails[0].price} MMK</p>
                                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No Orders Found
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600">You haven't placed any orders yet.</p>
              </div>
            )}

            {total > 0 && (
              <div className="mt-8 mx-auto max-w-sm bg-white rounded-xl shadow p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-blue-600 mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405M19.595 15.595A8 8 0 109 9.05" />
                  </svg>
                  Tax &amp; Service Charge
                </h3>
                <div className="space-y-3 text-gray-800 text-base">
                  <div className="flex justify-between">
                    <span>Tax </span>
                    <span>(0.1%)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Charge</span>
                    <span>{serviceCharge.toLocaleString()} MMK</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between text-green-700 font-medium">
                      <span>Discount ({discountName}{discountPercent ? `, ${discountPercent}%` : ''})</span>
                      <span>-{discountAmount.toLocaleString()} MMK</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Summary Card (blue, shows only the grand total) */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <p className="text-blue-100">Total Orders: {data.data.tableOrders?.length || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm opacity-90">Grand Total</p>
                  <p className="text-3xl font-bold">
                    {total.toLocaleString()} MMK
                  </p>
                </div>
              </div>
            </div>
            
            {/* Minimal Tax & Service Charge Box */}
            

          </div>
        )}

        {/* Empty state - No customer found */}
        {data && !data.success && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Customer Found</h3>
            <p className="text-gray-600">No customer is associated with this table.</p>
          </div>
        )}

        {/* No Table Info */}
        {!tableInfo?.table_id && !isLoading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Table Selected</h3>
            <p className="text-gray-600">Please select a table first to view your orders.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default YourOrder