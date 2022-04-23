const express = require("express");
const app = express();

const router = express.Router();

const getBookings = require('./booking')
const getAirbnb = require('./airnbnb')



router.get("/api/data/:mesto", async (req, res) => {
    console.log("PARAMS", req.params);
    console.log("QUERY", req.query);
  
    try {
      const [booking, airbnb] = await Promise.all([
        getAirbnb(
          req.params.mesto,
          req.query.startDay,
          req.query.startMonth,
          req.query.endDay,
          req.query.endMonth
        ),
        getBookings(
          req.params.mesto,
          req.query.startDay,
          req.query.startMonth,
          req.query.endDay,
          req.query.endMonth
        ),
      ]);
      res.status(200).json({ air: airbnb, book: booking});
    } catch (err) {
      res.status(500).json({
        error: "Something went wrong",
        message: err.message,
      });
      console.log(err);
    }
  });
    

const cors = require("cors");
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

app.use(router)

const port = process.env.PORT || 4242
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
