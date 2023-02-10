export const ApiRoutes = {
  authentication: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPassword: '/forgotPassword',
    changePassword: '/changePassword',
  },
  category: {
    categories: '/categories',
  },
  product: {
    products: '/products',
  },
  order: {
    orders: '/orders',
    orderByUserId: '/orders/user',
  },
};
