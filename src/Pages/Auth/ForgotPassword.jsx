import { Button, Form, Input } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import keyIcon from "../../assets/key.png";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    navigate(`/auth/verify-otp?email=${values?.email}`);
  };

  return (
    <div>
      <img src={keyIcon} alt="KeyIcon" className="mb-[24px] mx-auto" />
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Forgot password?</h1>
        <p className="w-[90%] mx-auto text-base">
          No worries, we’ll send you reset instructions.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label={<p>Email</p>}
          name="email"
          id="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            placeholder="Enter your email address"
            style={{
              height: 40,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
              borderRadius: "200px",
              borderColor: "#3FAE6A",
            }}
          />
        </Form.Item>

        <Form.Item>
          <button
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              borderRadius: "200px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            Submit
          </button>
        </Form.Item>
      </Form>
      <div className="">
        <Link
          to="/auth/login"
          className="flex items-center justify-center gap-1 text-[#667085] hover:text-[#3FAE6A] text-center mt-4"
        >
          <ArrowLeft size={20} />
          <p>Back to log in</p>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
