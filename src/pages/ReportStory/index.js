import { useState } from "react";
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";

const ReportStory = () => {
  const [reports, setReports] = useState({
    report: "",
    concern: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReports({ ...reports, [name]: value });
  };
  return (
    <>
      <div className="report-modal-body">
        <div className="mb-4">
          <Typography size={14} text="secondary">
            Please select a reason you are reporting this content.
          </Typography>
        </div>
        <div className="report-reason">
          <label className="flex cursor-pointer mb-3">
            <div className="mr-2 ">
              <input type="radio" name="report" className="form-radio focus:ring-blue-4 h-4 w-4 text-blue-4 border-gray-3" value="Offensive" onChange={handleChange}></input>{" "}
            </div>
            <div>
              <Typography size={14} text="secondary">
                Offensive
              </Typography>
            </div>
          </label>
          <label className="flex cursor-pointer mb-3">
            <div className="mr-2">
              <input type="radio" name="report" className="form-radio focus:ring-blue-4 h-4 w-4 text-blue-4 border-gray-3" onChange={handleChange} value="Spam or Advertising"></input>{" "}
            </div>
            <div>
              <Typography size={14} text="secondary">
                Spam or Advertising
              </Typography>
            </div>
          </label>
          <label className="flex cursor-pointer mb-3">
            <div className="mr-2">
              <input type="radio" name="report" className="form-radio focus:ring-blue-4 h-4 w-4 text-blue-4 border-gray-3" onChange={handleChange} value="Harrassment"></input>{" "}
            </div>
            <div>
              <Typography size={14} text="secondary">
                Harrassment
              </Typography>
            </div>
          </label>
          <label className="flex cursor-pointer mb-3">
            <div className="mr-2">
              <input type="radio" name="report" className="form-radio focus:ring-blue-4 h-4 w-4 text-blue-4 border-gray-3" onChange={handleChange} value="Copyright Infringement"></input>{" "}
            </div>
            <div>
              <Typography size={14} text="secondary">
                Copyright Infringement
              </Typography>
            </div>
          </label>
          <label className="flex cursor-pointer mb-3">
            <div className="mr-2">
              <input type="radio" name="report" className="form-radio focus:ring-blue-4 h-4 w-4 text-blue-4 border-gray-3" onChange={handleChange} value="Other"></input>{" "}
            </div>
            <div>
              <Typography size={14} text="secondary">
                Other
              </Typography>
            </div>
          </label>
        </div>
        <div className="mb-10 pt-1">
          <textarea
            className="border border-gray-3 focus:ring-2 focus:ring-blue-4 outline-none rounded-lg px-4 py-2 
    placeholder-gray-4 resize-none w-full text-sm"
            placeholder="Please explain your concern"
            onChange={handleChange}
            name="concern"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <div className="mr-2">
            <Button type="default-dark" size="large" fontWeight="medium" title="Cancel" />
          </div>
          <div>
            <Button size="large" fontWeight="medium" title="Submit" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportStory;
