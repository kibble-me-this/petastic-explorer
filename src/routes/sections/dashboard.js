import { lazy, Suspense } from 'react';
import { Outlet, useNavigate, useParams, Navigate } from 'react-router-dom'; // Added Navigate
// auth
import { AuthGuard, GuestGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';
import { JobDetailsContextProvider } from 'src/sections/organization/view/job-details-context-provider';
// Import tab-specific components
import PetsTab from 'src/sections/organization/view/tabs/pets-tab';
import FostersTab from 'src/sections/organization/view/tabs/fosters-tab';
import ShopTab from 'src/sections/organization/view/tabs/shop-tab';
import OrdersTab from 'src/sections/organization/view/tabs/orders-tab';


const JobDetailsView = lazy(() => import('src/sections/organization/view/org-details-view'));

// pages
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewEcommercePage = lazy(() => import('src/pages/dashboard/ecommerce'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
const OverviewBankingPage = lazy(() => import('src/pages/dashboard/banking'));
const OverviewBookingPage = lazy(() => import('src/pages/dashboard/booking'));
const OverviewFilePage = lazy(() => import('src/pages/dashboard/file'));
// PRODUCT
const ProductDetailsPage = lazy(() => import('src/pages/dashboard/product/details'));
const ProductListPage = lazy(() => import('src/pages/dashboard/product/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/product/new'));
const ProductEditPage = lazy(() => import('src/pages/dashboard/product/edit'));

// PRODUCT ADMIN
const ProductListAdminPage = lazy(() => import('src/pages/dashboard/product/admin/list'));

// ORDER
const OrderListPage = lazy(() => import('src/pages/dashboard/order/list'));
const OrderDetailsPage = lazy(() => import('src/pages/dashboard/order/details'));
// INVOICE
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoice/list'));
const InvoiceDetailsPage = lazy(() => import('src/pages/dashboard/invoice/details'));
const InvoiceCreatePage = lazy(() => import('src/pages/dashboard/invoice/new'));
const InvoiceEditPage = lazy(() => import('src/pages/dashboard/invoice/edit'));
// USER
const UserProfilePage = lazy(() => import('src/pages/dashboard/user/profile'));
const UserCardsPage = lazy(() => import('src/pages/dashboard/user/cards'));
const UserListPage = lazy(() => import('src/pages/dashboard/user/list'));
const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const UserCreatePage = lazy(() => import('src/pages/dashboard/user/new'));
const UserEditPage = lazy(() => import('src/pages/dashboard/user/edit'));
// PET
const PetProfilePage = lazy(() => import('src/pages/dashboard/pet/profile'));
const PetCardsPage = lazy(() => import('src/pages/dashboard/pet/cards'));
const PetListPage = lazy(() => import('src/pages/dashboard/pet/list'));
const PetAccountPage = lazy(() => import('src/pages/dashboard/pet/account'));
const PetCreatePage = lazy(() => import('src/pages/dashboard/pet/new'));
const PetEditPage = lazy(() => import('src/pages/dashboard/pet/edit'));
// BLOG
const BlogPostsPage = lazy(() => import('src/pages/dashboard/post/list'));
const BlogPostPage = lazy(() => import('src/pages/dashboard/post/details'));
const BlogNewPostPage = lazy(() => import('src/pages/dashboard/post/new'));
const BlogEditPostPage = lazy(() => import('src/pages/dashboard/post/edit'));
// ORG-PET
const PetsPage = lazy(() => import('src/pages/dashboard/orgpet/list'));
const PetPage = lazy(() => import('src/pages/dashboard/orgpet/details'));
const NewPetPage = lazy(() => import('src/pages/dashboard/orgpet/new'));
const EditPetPage = lazy(() => import('src/pages/dashboard/orgpet/edit'));

// ORGANIZATIONS
const JobDetailsPage = lazy(() => import('src/pages/dashboard/org/details'));
const JobListPage = lazy(() => import('src/pages/dashboard/org/list'));
const JobCreatePage = lazy(() => import('src/pages/dashboard/org/new'));
const JobEditPage = lazy(() => import('src/pages/dashboard/org/edit'));
const ProductListPageCO = lazy(() => import('src/pages/product/list'));
const ProductDetailsPageCO = lazy(() => import('src/pages/product/details'));
const ProductCheckoutPage = lazy(() => import('src/pages/product/checkout'));

// ORGANIZATIONS ADMIN
const OrganizationListAdminPage = lazy(() => import('src/pages/dashboard/org/admin/list'));
const OrganizationCreateAdminPage = lazy(() => import('src/pages/dashboard/org/admin/new'));


// TOUR
const TourDetailsPage = lazy(() => import('src/pages/dashboard/tour/details'));
const TourListPage = lazy(() => import('src/pages/dashboard/tour/list'));
const TourCreatePage = lazy(() => import('src/pages/dashboard/tour/new'));
const TourEditPage = lazy(() => import('src/pages/dashboard/tour/edit'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// APP

// Custom component for chat page navigation
const ConditionalChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  if (id) {
    navigate(`/dashboard/chat?id=${id}`);
  } else {
    return null; // Return null when 'id' is not present
  }

  return null;
};

const ChatPage = lazy(() => import('src/pages/dashboard/chat'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
const CalendarPage = lazy(() => import('src/pages/dashboard/calendar'));
const KanbanPage = lazy(() => import('src/pages/dashboard/kanban'));
// TEST RENDER PAGE BY ROLE
const PermissionDeniedPage = lazy(() => import('src/pages/dashboard/permission'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'banking', element: <OverviewBankingPage /> },
      {
        path: 'user',
        children: [
          { element: <UserProfilePage />, index: true },
          { path: 'profile', element: <UserProfilePage /> },
          { path: 'cards', element: <UserCardsPage /> },
          { path: 'list', element: <UserListPage /> },
          { path: 'new', element: <UserCreatePage /> },
          { path: ':id/edit', element: <UserEditPage /> },
          { path: 'account', element: <UserAccountPage /> },
        ],
      },
      {
        path: 'pet',
        children: [
          { element: <PetProfilePage />, index: true },
          { path: 'profile', element: <PetProfilePage /> },
          { path: 'cards', element: <PetCardsPage /> },
          { path: 'list', element: <PetListPage /> },
          { path: 'new', element: <PetCreatePage /> },
          { path: ':id/edit', element: <PetEditPage /> },
          { path: 'account', element: <PetAccountPage /> },
        ],
      },
      {
        path: 'product',
        children: [
          { element: <ProductListPage />, index: true },
          { path: 'list', element: <ProductListPage /> },
          { path: ':id', element: <ProductDetailsPage /> },
          { path: 'new', element: <ProductCreatePage /> },
          { path: ':id/edit', element: <ProductEditPage /> },

          // admin
          { path: 'admin/list', element: <ProductListAdminPage /> },
        ],
      },
      {
        path: 'order',
        children: [
          { element: <OrderListPage />, index: true },
          { path: 'list', element: <OrderListPage /> },
          { path: ':accountId/:id', element: <OrderDetailsPage /> },
        ],
      },
      {
        path: 'invoice',
        children: [
          { element: <InvoiceListPage />, index: true },
          { path: 'list', element: <InvoiceListPage /> },
          { path: ':id', element: <InvoiceDetailsPage /> },
          { path: ':id/edit', element: <InvoiceEditPage /> },
          { path: 'new', element: <InvoiceCreatePage /> },
        ],
      },
      {
        path: 'post',
        children: [
          { element: <BlogPostsPage />, index: true },
          { path: 'list', element: <BlogPostsPage /> },
          { path: ':title', element: <BlogPostPage /> },
          { path: ':title/edit', element: <BlogEditPostPage /> },
          { path: 'new', element: <BlogNewPostPage /> },
        ],
      },
      {
        path: 'orgpets',
        children: [
          { element: <PetsPage />, index: true },
          { path: 'list', element: <PetsPage /> },
          { path: ':title', element: <PetPage /> },
          { path: ':title/edit', element: <EditPetPage /> },
          { path: 'new', element: <NewPetPage /> },
        ],
      },
      {
        path: 'org',
        children: [
          { element: <JobListPage />, index: true },
          { path: 'list', element: <JobListPage /> },
          {
            path: ':id',
            element: (
              <JobDetailsContextProvider>
                <JobDetailsView />
              </JobDetailsContextProvider>
            ),
            children: [
              { path: '', element: <Navigate to="pets" replace /> },
              { path: 'pets', element: <PetsTab /> },
              { path: 'fosters', element: <FostersTab /> },
              { path: 'shop', element: <ShopTab /> },
              { path: 'orders', element: <OrdersTab /> },
            ],
          },
          { path: 'new', element: <JobCreatePage /> },
          { path: ':id/edit', element: <JobEditPage /> },
          {
            path: 'product',
            children: [
              { element: <ProductListPageCO />, index: true },
              { path: 'list', element: <ProductListPageCO /> },
              { path: ':id', element: <ProductDetailsPageCO /> },
              { path: 'checkout', element: <ProductCheckoutPage /> },
            ],
          },

          // admin
          { path: 'admin/list', element: <OrganizationListAdminPage /> },
          { path: 'admin/new', element: <OrganizationCreateAdminPage /> },

        ],
      },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:id', element: <ChatPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'permission', element: <PermissionDeniedPage /> },
      { path: 'blank', element: <BlankPage /> },
    ],
  },
];
