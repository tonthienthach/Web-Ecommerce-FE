import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Rating from "react-rating";
import { toast } from "react-toastify";
import rateApi from "../axios/rateApi";

const ModalReview = (props) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const element = document.getElementById("message");
    if (!review) {
      element.value = "";
    }
  }, [review]);

  const handleAddRate = async (e, body) => {
    e.preventDefault();
    if (!rating) {
      toast.warning("Please select a rating");
      return;
    }
    const { data } = await rateApi.addRateByUser(body);
    if (data.success) {
      toast.success("Add Rate Successful");
      setRating(0);
      setReview("");
    } else {
      toast.error(data.message);
    }
  };

  const handleRating = (value) => {
    setRating(value);
  };

  return (
    <>
      <Button
        variant="info"
        className="rounded"
        data-toggle="modal"
        data-target={"#modalReview" + props.product._id}
      >
        Review
      </Button>

      <div
        className="modal fade"
        id={"modalReview" + props.product._id}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="modalReviewLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog " role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="modalReviewLabel">
                Review
              </h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <h4 className="mb-4">Leave a review</h4>
              <small>Required fields are marked *</small>
              <div className="d-flex my-3">
                <p className="mb-0 mr-2">Your Rating * :</p>
                <div className="text-primary">
                  <Rating
                    initialRating={rating}
                    emptySymbol={<i className="far fa-star"></i>}
                    fullSymbol={<i className="fas fa-star"></i>}
                    onClick={handleRating}
                  />
                </div>
              </div>
              <form
                onSubmit={(e) =>
                  handleAddRate(e, {
                    product: props.product._id,
                    content: review,
                    score: rating,
                  })
                }
              >
                <div className="form-group">
                  <label htmlFor="message">Your Review *</label>
                  {review ? (
                    <textarea
                      id="message"
                      rows="5"
                      className="form-control w-100"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  ) : (
                    <textarea
                      id="message"
                      rows="5"
                      className="form-control w-100"
                      defaultValue={""}
                      onChange={(e) => setReview(e.target.value)}
                    ></textarea>
                  )}
                  {/* <textarea
                    id="message"
                    rows="5"
                    className="form-control w-100"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  ></textarea> */}
                </div>
              </form>{" "}
            </div>
            <div className="modal-footer">
              <Button data-dismiss="modal" className="rounded" variant="danger">
                Close
              </Button>
              <Button
                variant="info"
                className="rounded"
                onClick={(e) =>
                  handleAddRate(e, {
                    product: props.product._id,
                    content: review,
                    score: rating,
                  })
                }
              >
                Review
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalReview;
