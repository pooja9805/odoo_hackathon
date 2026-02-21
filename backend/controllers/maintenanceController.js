const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addMaintenance = async (req, res) => {
 try{

  const { vehicleId, details, cost, date } = req.body;

  if(!vehicleId || !details || !cost || !date){
   return res.status(400).json({message:"Missing fields"});
  }

  const log = await prisma.maintenanceLog.create({
   data:{
    vehicleId:Number(vehicleId),
    details,
    cost:Number(cost),
    date:new Date(date)
   }
  });

  // AUTO IN SHOP
  await prisma.vehicle.update({
   where:{id:Number(vehicleId)},
   data:{status:"In Shop"}
  });

  res.json(log);

 }catch(err){
  console.error(err);
  res.status(400).json({message:"Failed"});
 }
};

exports.getMaintenance = async (req, res) => {
 const logs = await prisma.maintenanceLog.findMany({
  include:{vehicle:true},
  orderBy:{date:"desc"}
 });

 res.json(logs);
};