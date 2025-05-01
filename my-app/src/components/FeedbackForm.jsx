import React, { useState } from 'react';

const FeedbackForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comments });
  };

  return (
    <div>
      <h2>Session Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rate your experience (1-5):
          <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
            {[1,2,3,4,5].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Comments:
          <br />
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} rows={4} cols={50} />
        </label>
        <br />
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

export default FeedbackForm;
