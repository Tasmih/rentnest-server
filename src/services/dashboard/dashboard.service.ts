import prisma from "../../lib/prisma";

// Admin Dashboard Stats
const getAdminDashboard = async () => {
  const [
    totalUsers,
    totalLandlords,
    totalTenants,
    totalProperties,
    availableProperties,
    rentedProperties,
    totalRentalRequests,
  ] = await Promise.all([
    prisma.user.count({
      where: { isDeleted: false },
    }),
    prisma.user.count({
      where: { role: "LANDLORD", isDeleted: false },
    }),
    prisma.user.count({
      where: { role: "TENANT", isDeleted: false },
    }),
    prisma.property.count({
      where: { isDeleted: false },
    }),
    prisma.property.count({
      where: { status: "AVAILABLE", isDeleted: false },
    }),
    prisma.property.count({
      where: { status: "RENTED", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { isDeleted: false },
    }),
  ]);

  return {
    totalUsers,
    totalLandlords,
    totalTenants,
    totalProperties,
    availableProperties,
    rentedProperties,
    totalRentalRequests,
  };
};

// Landlord Dashboard Stats
const getLandlordDashboard = async (userId: string) => {
  const [
    totalPropertiesOwned,
    availableProperties,
    rentedProperties,
    pendingRentalRequests,
    acceptedRentalRequests,
  ] = await Promise.all([
    prisma.property.count({
      where: { landlordId: userId, isDeleted: false },
    }),
    prisma.property.count({
      where: { landlordId: userId, status: "AVAILABLE", isDeleted: false },
    }),
    prisma.property.count({
      where: { landlordId: userId, status: "RENTED", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: {
        isDeleted: false,
        status: "PENDING",
        property: { landlordId: userId, isDeleted: false },
      },
    }),
    prisma.rentalRequest.count({
      where: {
        isDeleted: false,
        status: "ACCEPTED",
        property: { landlordId: userId, isDeleted: false },
      },
    }),
  ]);

  return {
    totalPropertiesOwned,
    availableProperties,
    rentedProperties,
    pendingRentalRequests,
    acceptedRentalRequests,
  };
};

// Tenant Dashboard Stats
const getTenantDashboard = async (userId: string) => {
  const [
    totalRentalRequests,
    pendingRequests,
    acceptedRequests,
    totalFavorites,
  ] = await Promise.all([
    prisma.rentalRequest.count({
      where: { tenantId: userId, isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: "PENDING", isDeleted: false },
    }),
    prisma.rentalRequest.count({
      where: { tenantId: userId, status: "ACCEPTED", isDeleted: false },
    }),
    prisma.favorite.count({
      where: { userId, status: "ACTIVE", isDeleted: false },
    }),
  ]);

  return {
    totalRentalRequests,
    pendingRequests,
    acceptedRequests,
    totalFavorites,
  };
};

export const DashboardService = {
  getAdminDashboard,
  getLandlordDashboard,
  getTenantDashboard,
};
