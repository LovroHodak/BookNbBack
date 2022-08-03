const express = require("express");
const app = express();

const router = express.Router();

const getBookings = require('./booking')
const getAirbnb = require('./airnbnb')



router.get("/api/data/:mesto", async (req, res) => {
    //console.log("PARAMS", req.params);
    //console.log("QUERY", req.query);
  
    try {
      let error

      //let error = undefined
      
      const [booking, airbnb] = await Promise.all([
        //.catch(() => []) -> ce je error mi daj prazen arr da mi rendera vsaj tistega ki je success
        getAirbnb(
          req.params.mesto,
          req.query.startDay,
          req.query.startMonth,
          req.query.endDay,
          req.query.endMonth
        ).catch((err) => {error = err; return []}),
        getBookings(
          req.params.mesto,
          req.query.startDay,
          req.query.startMonth,
          req.query.endDay,
          req.query.endMonth
        ).catch((err) => {error = err; return []}),
      ]);
      if (error)
        console.log(error)
      if (!airbnb.length && !booking.length && error){
        throw error
      }
      let errorMessage 
      if (!airbnb.length && error){
        errorMessage = 'Cannot fetch Airbnb data'
      }
      if (!booking.length && error){
        errorMessage = 'Cannot fetch Booking data'
      }
      res.status(200).json({ air: airbnb, book: booking, errorMessage});
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
    origin: ["http://localhost:3000", "https://booknb.netlify.app"],
  })
);

app.use(router)

const port = process.env.PORT || 4242
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
