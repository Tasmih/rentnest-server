import "dotenv/config";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { propertyImages } from "./property-images";
import { PropertyType } from "../src/generated/prisma/enums";

const areas = [
  "Gulshan",
  "Banani",
  "Bashundhara R/A",
  "Dhanmondi",
  "Uttara",
  "Mirpur",
  "Mohammadpur",
  "Badda",
  "Rampura",
  "Wari",
];

const propertyTemplates: Record<
  string,
  { titles: string[]; descriptions: string[]; defaultCategory: string; avgRent: number }
> = {
  FLAT: {
    titles: [
      "Modern Family Apartment in",
      "Luxury Residential Flat in",
      "Spacious City Apartment in",
      "Premium Family Flat in",
      "Executive Living Apartment in",
    ],
    descriptions: [
      "A spacious modern family flat with full amenities, balcony, and 24/7 security.",
      "Well-ventilated residential apartment located in a prime quiet neighborhood.",
      "Modern flat equipped with generator backup, lift, and dedicated parking space.",
    ],
    defaultCategory: "Apartment",
    avgRent: 22000,
  },
  ROOM: {
    titles: [
      "Comfortable Single Room in",
      "Premium Bachelor Room in",
      "Private Room Near University in",
      "Master Room with Balcony in",
      "Quiet Study Room in",
    ],
    descriptions: [
      "A clean private room suitable for students and working professionals.",
      "Spacious room with attached bath, high-speed WiFi, and quiet environment.",
      "Fully furnished room in a quiet residential flat with shared kitchen access.",
    ],
    defaultCategory: "Room",
    avgRent: 8500,
  },
  SEAT: {
    titles: [
      "Shared Seat in Student Mess in",
      "Student Seat Available in",
      "Affordable Seat Rental in",
      "Quiet Seat in Bachelor Flat in",
      "Mess Seat Near Campus in",
    ],
    descriptions: [
      "A well-maintained seat in a quiet student mess with 3-time meal facilities.",
      "Affordable single seat available for students with utility bills included.",
      "Clean seat in a spacious room with attached bath and study table.",
    ],
    defaultCategory: "Room",
    avgRent: 4000,
  },
  SUBLET: {
    titles: [
      "Family Sublet Available in",
      "Furnished Sublet Room in",
      "Master Bed Sublet in",
      "Single Room Sublet in",
      "Executive Sublet Flat in",
    ],
    descriptions: [
      "Furnished sublet room available with attached bathroom and balcony.",
      "Spacious family sublet in a quiet flat with drawing and dining access.",
      "Clean master bed sublet suitable for job holders or small families.",
    ],
    defaultCategory: "Sublet",
    avgRent: 13500,
  },
  HOSTEL: {
    titles: [
      "Student Hostel Room in",
      "Premium Hostel Accommodation in",
      "Modern Boys Hostel Seat in",
      "Girls Hostel Room in",
      "Executive Hostel Seat in",
    ],
    descriptions: [
      "Clean hostel accommodation with high-speed WiFi, CCTV security, and meals.",
      "Modern student hostel with quiet study atmosphere and laundry service.",
      "Comfortable hostel seat with 24/7 security guard and generator backup.",
    ],
    defaultCategory: "Hostel",
    avgRent: 6000,
  },
};

async function main() {
  console.log("🌱 Seeding started...");

  // Categories
  const categoryNames = ["Apartment", "House", "Room", "Hostel", "Sublet"];
  const categories: Record<string, string> = {};

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: `${name} rental property`,
      },
    });
    categories[name] = category.id;
  }

  // Admin User
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      phone: "01700000002",
      role: "ADMIN",
    },
  });

  // Landlord User
  const hashPassword = await bcrypt.hash("Landlord@123", 10);
  const landlord = await prisma.user.upsert({
    where: { email: "landlord@gmail.com" },
    update: {},
    create: {
      name: "Landlord",
      email: "landlord@gmail.com",
      password: hashPassword,
      phone: "01700000000",
      role: "LANDLORD",
    },
  });

  // Tenant User
  const tenantPassword = await bcrypt.hash("Tenant@123", 10);
  await prisma.user.upsert({
    where: { email: "tenant@gmail.com" },
    update: {},
    create: {
      name: "Tenant",
      email: "tenant@gmail.com",
      password: tenantPassword,
      phone: "01700000001",
      role: "TENANT",
    },
  });

  // Remove old properties owned by test landlord
  await prisma.property.deleteMany({
    where: {
      landlordId: landlord.id,
    },
  });

  // Create 100 realistic Properties
  const propertyTypesList: PropertyType[] = ["FLAT", "ROOM", "SEAT", "SUBLET", "HOSTEL"];
  let count = 0;

  for (let i = 1; i <= 100; i++) {
    const area = areas[i % areas.length];
    const propertyType = propertyTypesList[i % propertyTypesList.length];
    const template = propertyTemplates[propertyType];

    const titlePrefix = template.titles[i % template.titles.length];
    const title = `${titlePrefix} ${area} #${i}`;
    const description = `${template.descriptions[i % template.descriptions.length]} Located near main road ${area}, Dhaka.`;

    const rent = template.avgRent + (i % 10) * 500;
    const serviceCharge = propertyType === "FLAT" ? 2000 : 500;
    const utilityCharge = propertyType === "FLAT" ? 1500 : 300;

    const bedrooms = propertyType === "FLAT" ? 3 : propertyType === "SUBLET" ? 2 : 1;
    const bathrooms = propertyType === "FLAT" ? 2 : 1;

    const isBachelorAllowed = propertyType === "ROOM" || propertyType === "SEAT" || propertyType === "HOSTEL";
    const isFamilyAllowed = propertyType === "FLAT" || propertyType === "SUBLET";

    const targetCategory = categories[template.defaultCategory] || categories["Apartment"];

    await prisma.property.create({
      data: {
        title,
        description,
        rent,
        serviceCharge,
        utilityCharge,
        area,
        address: `Road ${(i % 15) + 1}, ${area}, Dhaka`,
        propertyType,
        categoryId: targetCategory,
        floor: (i % 8) + 1,
        totalFloors: 10,
        bedrooms,
        bathrooms,
        coverImage: propertyImages[i % propertyImages.length],
        furnished: true,
        parking: propertyType === "FLAT",
        lift: true,
        bachelorAllowed: isBachelorAllowed,
        familyAllowed: isFamilyAllowed,
        landlordId: landlord.id,
        status: "AVAILABLE",
      },
    });

    count++;
  }

  console.log(`✅ Seeded ${count} properties with accurate titles & descriptions.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });