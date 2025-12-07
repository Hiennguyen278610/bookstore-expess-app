import express from 'express';
import { auth } from '../middlewares/auth.js';
import { createAddress, deleteAddress, getAllAddress, updateAddress } from '../controllers/AddressController.js';

const router = express.Router();

router.get("/provinces", async (req, res) => {
  try {
    const data = await fetch("https://esgoo.net/api-tinhthanh-new/1/0.htm");
    const json = await data.json();
    res.json(json);
  } catch (error) {
    console.log(error);
  }
})
router.get('/districts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await fetch(`https://esgoo.net/api-tinhthanh-new/2/${id}.htm`);
    const json = await data.json();
    res.json(json);
  } catch (error) {
    console.log(error);
  }
})

router.post("/", auth, createAddress)

router.put("/:id", auth,updateAddress)

router.get("/", auth, getAllAddress)

router.delete("/:id", auth,deleteAddress)
export default router;