import React, { useState } from 'react';
import { FaFacebook, FaInstagram, FaReddit, FaTwitter, FaYoutube, FaStar } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = 'Name is required';
    if (!formData.email) tempErrors.email = 'Email is required';
    if (!formData.phone) tempErrors.phone = 'Phone is required';
    if (!formData.message) tempErrors.message = 'Message is required';
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted:', formData, 'Rating:', rating);
      setSuccessMessage('Thank you for contacting us! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setErrors({});
      setRating(0);
      setHoverRating(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffe2b7] p-6 md:p-12 flex justify-center items-start">
      <div className="max-w-4xl w-full">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md flex flex-col space-y-4"
        >
          <h2 className="text-3xl font-bold text-amber-600 uppercase tracking-wider">
            Contact Us
          </h2>
          <h1 className="text-xl font-bold mb-2">We'd love to hear from you!</h1>

          {successMessage && <p className="text-green-600">{successMessage}</p>}

          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="flex-1 p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="flex-1 p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="flex-1 p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message"
            rows="4"
            className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
          ></textarea>
          {errors.message && <p className="text-red-500">{errors.message}</p>}

          <div className="flex items-center gap-2 mt-2">
            <span className="font-bold">Rate us:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                size={24}
                className={`cursor-pointer transition ${
                  star <= (hoverRating || rating) ? 'text-amber-500' : 'text-gray-300'
                }`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white p-3 rounded-lg hover:bg-amber-500 transition"
          >
            Send Message
          </button>
        </form>

        <div className="bg-white mt-6 p-8 rounded-lg shadow-md flex flex-col items-center">
          <h3 className="text-lg font-bold mb-3">Stay Connected</h3>
          <div className="flex gap-6">
            <FaFacebook className="text-3xl hover:text-blue-600 transition" />
            <FaTwitter className="text-3xl hover:text-sky-500 transition" />
            <FaInstagram className="text-3xl hover:text-pink-500 transition" />
            <FaReddit className="text-3xl hover:text-orange-600 transition" />
            <FaYoutube className="text-3xl hover:text-red-600 transition" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
