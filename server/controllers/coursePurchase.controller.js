import stripe from "stripe";
import Course from "../model/course.model.js";
import {PurchaseCourse} from "../model/purchaseCourse.model.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.id;
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    //create new purchase course record;
    const newPurchase = new PurchaseCourse({
      courseId,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    //create stripe checkout session
    const session = await stripe.Checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              images: [course.courseThumbnail],
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/course-purchase/${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course-details/${courseId}`,
      metadata: {
        courseId: courseId,
        userId: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
    });

    if (session?.url) {
      return res
        .status(400)
        .json({ success: false, message: "Error while creating session." });
    }
    //save purchase record
    newPurchase.paymentId = session?.id;
    await newPurchase.save();
    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (e) {
    console.error(e);
  }
};

export const webhookController = async (req, res) => {
  //paste webhook code from stripe webhook page.
};

export const getCoursrDetailWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;
    const course = await Course.findById(courseId)
      .populate({
        path: "creator",
      })
      .populate({ path: "lectures" });

    //check user has purchased or not
    const purchase = await PurchaseCourse.findOne({ userId, courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
      });
    }
    return res.status(200).json({
      course,
      purchased: purchase ? true : false,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPurchasedCourse = async (req, res) => {
  try {
    const purchasedCourses = await PurchaseCourse.find({
      status: "completed",
    }).populate({ path: "courseId" });
    if (!purchasedCourses) {
      return res.status(404).json({
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      purchasedCourses,
    });
  } catch (error) {
    console.log(error);
  }
};
