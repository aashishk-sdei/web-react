import Typography from "./../../../components/Typography";
import Button from "./../../../components/Button";
import './index.css'

const ReportPage = () => {
    return <>
        <div className="pt-18 md:pt-22.5 main-wrapper mx-auto w-full">
            <div className="mb-5">
                <Typography size={20} weight="medium" text="secondary">
                    Flagged Stories (3)
                </Typography>
            </div>
            <div>
                <div className="bg-white shadow-md p-1 mb-4">
                    <div className="flex">
                        <div className="reported-media bg-gray-2 flex relative overflow-hidden">
                        <img src="https://test.storied.com/cdn-cgi/image/q=100,w=500,h=700/https://testmedia.storied.com/storied-user-content/b0abee28-4e56-46df-9338-d5992601986f/images/0bafa971-7294-40de-a463-82aa0b230fea.png" className="w-auto h-auto absolute left-2/4 top-2/4 transform -translate-x-2/4 -translate-y-2/4" alt=""  />
                        </div>
                        <div className="reported-info flex-grow py-4 pl-8">
                            <div className="flex">
                                <div>
                                    <div className="head">
                                        <h4 className="mb-2">
                                            <Typography size={24} weight="lyon-medium" text="secondary">
                                                <span className="tw-ellipsis-onel">Dr. Fünke's 100% Natural Good-Time Family Band Dr. Fünke's 100% Natural Good-Time Family Band</span>
                                            </Typography>
                                        </h4>
                                        <p>
                                        <Typography size={14}>
                                        Aug 8 1913 <span className="dot-seprator"> Ogden, Weber, Utah, USA</span>
                                        </Typography>
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="mb-2">
                                            <Typography size={14} text="secondary">
                                              <span className="tw-ellipsis-threel"> Thinking it could rekindle his relationship with Lindsay, Tobias attempted to get the band back together in 2004 for an upcoming Wellness Convention. The band would now be promoting Euphorazine but Lindsay was unable to get into the...</span>
                                            </Typography>
                                        </p>
                                        <div>
                                           <p>
                                           <Typography size={14}>
                                                Author: Cody Mortensen
                                            </Typography>
                                           </p>
                                           <p>
                                            <Typography size={14}>
                                            Email: cmortensen@worldarchives.com                                                
                                            </Typography>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pl-10 pr-8 flag-reason-info">
                                    <div>
                                        <div className="head">
                                            <h3 className="mb-2">
                                                <Typography size={20} weight="medium" text="secondary">
                                                    Flagged For
                                                </Typography>
                                            </h3>
                                        </div>
                                        <div className="mb-3">
                                            <p>
                                                <Typography size={16} text="secondary">
                                                    Spam or Advertising
                                                </Typography>
                                            </p>
                                        </div>
                                        <div className="mb-4">
                                            <p>
                                                <Typography size={14}>
                                                    By: Jordan Ireland
                                                </Typography>
                                            </p>
                                            <p>
                                                <Typography size={14}>
                                                    jireland@worldarchives.com
                                                </Typography>
                                            </p>
                                        </div>
                                        <div className="actions">
                                            <div className="flex">
                                                <div className="mr-2">
                                                    <Button icon="lock" size="large" type="danger" title="Lock" />
                                                </div>
                                                <div>
                                                    <Button icon="icon-check"  size="large" type="success" title="Approve" />
                                                </div>
                                                <div className="ml-2 btn-delete">
                                                <Button icon="trash"  size="large" type="default-dark" title="" />                                             
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </>
}

export default ReportPage