import "dotenv/config";
import prisma from "../src/lib/prisma";
import bcrypt from "bcrypt";
import { propertyImages } from "./property-images";



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



const propertyTitles = [
  "Luxury Family Apartment",
  "Modern Residential Flat",
  "Premium City Apartment",
  "Beautiful Family Home",
  "Comfortable Living Space",
];




async function main() {


  console.log("🌱 Seeding started...");



  // ==========================
  // Categories
  // ==========================


  const categoryNames = [
    "Apartment",
    "House",
    "Room",
    "Hostel",
    "Sublet",
  ];


  const categories:any = {};



  for(const name of categoryNames){


    const category =
      await prisma.category.upsert({

        where:{
          name,
        },


        update:{},


        create:{
          name,
          description:`${name} rental property`,
        },

      });


    categories[name] = category.id;

  }






  // Landlord



  const hashPassword =
    await bcrypt.hash(
      "Landlord@123",
      10
    );



  const landlord =
    await prisma.user.upsert({

      where:{
        email:"landlord@gmail.com",
      },


      update:{},


      create:{

        name:"Landlord",

        email:"landlord@gmail.com",

        password:hashPassword,

        phone:"01700000000",

        role:"LANDLORD",

      },

    });






  // remove old landlord properties

  await prisma.property.deleteMany({

    where:{
      landlordId: landlord.id,
    },

  });







  
  // Create 100 Properties
  


  let count = 0;



  for(let i=1; i<=100; i++){



    const area =
      areas[i % areas.length];



    await prisma.property.create({

      data:{


        title:
        `${propertyTitles[i % propertyTitles.length]} ${i}`,



        description:
        `Beautiful rental property located in ${area} with modern facilities`,



        rent:
        15000 + (i * 500),



        serviceCharge:
        1000 + (i * 50),



        utilityCharge:
        500,



        area,



        address:
        `Road ${i}, ${area}, Dhaka`,



        propertyType:
        i % 5 === 0
        ? "ROOM"
        : "FLAT",




        categoryId:
        i % 3 === 0
        ? categories["House"]
        : categories["Apartment"],




        floor:
        (i % 10)+1,



        totalFloors:
        10,



        bedrooms:
        2 + (i % 3),



        bathrooms:
        2,



        coverImage:
        propertyImages[i % propertyImages.length],




        furnished:true,


        parking:
        i % 2 === 0,



        lift:true,



        bachelorAllowed:false,


        familyAllowed:true,



        landlordId:
        landlord.id,



        status:"AVAILABLE",


      },

    });



    count++;

  }




  console.log(
    `✅ ${count} properties created`
  );


}




main()

.then(async()=>{

  await prisma.$disconnect();

})


.catch(async(error)=>{

  console.error(error);

  await prisma.$disconnect();

  process.exit(1);

});