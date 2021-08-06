import React, { useState } from "react";
import {
    PriceEstimate_main,
    PriceEstimate_container,
    PriceEstimate_container_b1,
    PriceEstimate_container_b2
} from './styles';
import { Form, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Link } from "gatsby";

const PriceEstimate = () => {
    //Prize array
    const array =
        [
            {
                id: 1,
                title: "Proof Reading & Editing",
                dollers: "0.020",
                rupees: "1.50",
            },
            {
                id: 2,
                title: "Substantive Editing",
                dollers: "0.024",
                rupees: "1.75",
            },
            {
                id: 1,
                title: "Plagarism Editing",
                dollers: "0.034",
                rupees: "2.50",
            },
        ]

    const proceedtopay = paymap => {

    }
    const [pay, setpay] = useState(null)
    const [toggleState, setToggleState] = useState(0)
    const [currency, setcurrency] = useState(1)

    const toggleTab = index => {
        setToggleState(index)
    }

    var finalpay = pay <= 100000 ? pay : 100000;
    const UpdateTime = !finalpay ? "" : finalpay <= 2000 ? 48 : finalpay === 2001 || finalpay <= 4000 ? 96 : finalpay === 4001 || finalpay <= 6000 ? 144 : finalpay === 6001 || finalpay <= 20000 ? 336 : finalpay >= 20001 ? 720 : "";
    var d = new Date();
    d.setHours(UpdateTime)
    const dayNumber = d.getDate();
    const year = d.getFullYear();
    const dayName = d.toLocaleString("default", { weekday: "long" });
    const monthName = d.toLocaleString("default", { month: "long" });

    const normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const [showUpload, setShowUpload] = useState(true);

    const uploadChange = (data) => {
        if (data.fileList.length > 0) {
            setShowUpload(false);
        }
    };

    const customReqChange = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 0);
    };

    const removeUploadedFile = () => {
        setShowUpload(true);
    };
    function transformFile(file) {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
                file.base64 = e.target.result;
                resolve(e.target.result);
            };
        });
    }
    return (
        <PriceEstimate_main>
            <PriceEstimate_container>
                <PriceEstimate_container_b1>
                    <div id="slide_label">
                        <h1>Calculate your price</h1>
                    </div>
                    <div id="slide_label">
                        <label htmlFor="firstName">How many words do you want to edit ?</label>
                        <div id="slider_buttons">
                            <input type="text" id="peinput" value={finalpay}
                                onChange={e => setpay(e.target.value)} max="100000" />
                        </div>
                    </div>
                    <div id="slide_label">
                        <label htmlFor="firstName">Choose your service</label>
                        <div id="slider_buttons">
                            {array && array.map((paymap, i) =>
                                <>
                                    <button key={i}
                                        className={
                                            toggleState === i
                                                ? "pay_block2_container1 pay_block2_container2"
                                                : "pay_block2_container1"
                                        }
                                        onClick={() => toggleTab(i)}
                                    >{paymap.title}</button>
                                </>
                            )}
                        </div>
                    </div>
                    <div id="slide_label">
                        <Form.Item
                            name='categoryFile'
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload name="category" listType="picture" id="categoryFile2" onChange={uploadChange} onRemove={removeUploadedFile} customRequest={customReqChange} transformFile={transformFile} >
                                {
                                    showUpload &&
                                    <Button className="uploadBtn2" disabled>
                                        <UploadOutlined /> Click to upload
                                    </Button>
                                }
                            </Upload>
                        </Form.Item>
                    </div>
                </PriceEstimate_container_b1>
                {array && array.map((paymap, i) => (
                    <>
                        {toggleState === i && (
                            <PriceEstimate_container_b2 key={i}>
                                <div id="p_b_top_main">
                                    <button onClick={() => setcurrency(1)} className={currency === 1 ? "currency1 currency2" : "currency1"}>₹ INR </button>
                                    <button onClick={() => setcurrency(2)} className={currency === 2 ? "currency1 currency2" : "currency1"}>$ USD</button>
                                </div>
                                <div id="p_b_top">
                                    <h1>Total Price</h1>
                                    {(currency === 1) ?
                                        <h2>₹ {paymap.rupees * finalpay}</h2>
                                        :
                                        <h2>$ {paymap.dollers * finalpay}</h2>
                                    }
                                </div>
                                <div id="p_b_middle">
                                    <h1>Returned before</h1>
                                    {!finalpay ?
                                        <h1>-</h1>
                                        :
                                        <h1>{dayName}, {monthName} {dayNumber}, {year}</h1>
                                    }
                                </div>
                                <div id="p_b_bottom">
                                    <Link to="/pricing/#pays"><button onClick={() => {
                                        proceedtopay(paymap)
                                    }}>Make Payment</button></Link>
                                </div>
                            </PriceEstimate_container_b2>
                        )}
                    </>
                ))}
            </PriceEstimate_container>
        </PriceEstimate_main>
    )
}
export default PriceEstimate;