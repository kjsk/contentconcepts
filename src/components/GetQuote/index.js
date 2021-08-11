import React, { useState } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { Form, Input, Radio, Row, Col, Upload, Button, Modal } from 'antd';
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import { QuoteFormSection, Quotepop } from './styles';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import Pay from "../Payment/index"

const GetQuote = ({ props, wordcount, currency, toggleState, dayNumber, year, dayName, monthName }) => {
  console.log(toggleState);
  const MainPrize = toggleState === 0 ? currency === 4 ? 1.50 * wordcount : 0.020 * wordcount : toggleState === 1 ? currency === 4 ? 1.75 * wordcount : 0.024 * wordcount : toggleState === 2 ? currency === 4 ? 2.50 * wordcount : 0.034 * wordcount : ("");
  const category = toggleState === 0 ? "Proofreading" : toggleState === 1 ? "Substantive Editing" : toggleState === 2 ? "Plagarism Editing" : ("");
  const currencyPrize = currency === 4 ? "₹" + MainPrize : currency === 5 ? "$" + MainPrize : "₹" + MainPrize;
  const [value, setValue] = useState();

  const [form] = Form.useForm();

  const { TextArea } = Input;

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

  const [disabled, setDisabled] = useState(false);
  //modal
  const [success, setSuccess] = useState();

  const onFinish = async values => {

    setDisabled(true);

    const data = new FormData();

    data.append("name", values.name);
    data.append("email", values.email);

    if (values.phone === undefined) {
      data.append("phone", '-');
    } else {
      data.append("phone", values.phone);
    }

    if (category === undefined) {
      data.append("category", '-');
    } else {
      data.append("category", category);
    }

    if (values.languageCategory === undefined) {
      data.append("languageCategory", '-');
    } else {
      data.append("languageCategory", values.languageCategory);
    }

    if (values.categoryFile !== undefined) {
      data.append("file", values.categoryFile[0].base64)
      data.append("filename", values.categoryFile[0].name);
    } else {
      data.append("filename", '-');
    }

    if (wordcount === undefined) {
      data.append("wordCount", '-');
    } else {
      data.append("wordCount", wordcount);
    }

    if (MainPrize === undefined) {
      data.append("prize", '-');
    } else {
      data.append("prize", MainPrize);
    }

    if (values.requirement === undefined) {
      data.append("requirement", '-');
    } else {
      data.append("requirement", values.requirement);
    }

    var url = "https://script.google.com/macros/s/AKfycbxPQYfAmU27Vfted5BMWK3Rmn8t6NMWFORuB9Q0X6umaZEpE2Oz/exec";

    await fetch(url, {
      method: 'POST',
      body: data,
      mode: 'no-cors',
    }).then(function (response) {
      setSuccess(true);
      setDisabled(false);
      form.resetFields();
      props.onSubmit();
    }).catch(function (err) {
      setDisabled(false);
    });
    setShowUpload(true);
  };

  const handelCancel = () => {
    setSuccess(false);
  }
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: {eq: "quoteCategory.md"}) {
        childMarkdownRemark {
          frontmatter {
            title
            categories {
              label
              value
            }
          }
        }
      }
    }
  `);

  const categoryData = data.file.childMarkdownRemark.frontmatter;
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [errors, setErrors] = useState("");
  const validation = () => {
    let errors = {};
    if (!name || name.length < 3) {
      errors.color = "red"
    } if (!email) {
      errors.color = "red"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.color = "red"
    }
    return errors;
  }
  const signnn = () => {
    setErrors(validation())
  }
  return (
    <>
      <QuoteFormSection>
        <Form name="quote-form" onFinish={onFinish} className="quoteForm gform" form={form}>
          <div>
            <label className="formLabel" htmlFor="categoryFile">Name{(!name) ? (<span style={{ color: (errors.color) }}>*</span>) : (<span>*</span>)}</label>
            <Form.Item
              name='name'
              rules={[
                {
                  required: true,
                  message: `Can't be blank`,
                },
              ]}
              value={name}
              onChange={e => setName(e.target.value)}
            >
              <Input placeholder="Name" />
            </Form.Item>
          </div>
          <Form.Item
            style={{
              marginBottom: 0,
            }}
            className="inputGroupBlock"
          >
            <div className="inlineInput">
              <label className="formLabel" htmlFor="category">Phone Number</label>
              <Form.Item
                name='phone'
              >
                <PhoneInput
                  international
                  defaultCountry="IN"
                  placeholder="Enter phone number"
                  value={value}
                  onChange={setValue} id="inlineInput" />
              </Form.Item>
            </div>
            <div className="inlineInput emailInput">
              <label className="formLabel" htmlFor="category">Email ID {(!email) ? (<span style={{ color: (errors.color) }}>*</span>) : (<span>*</span>)}</label>
              <Form.Item
                name='email'
                rules={[
                  {
                    required: true,
                    message: `Can't be blank`,
                  },
                  {
                    type: 'email',
                    message: `Please enter valid Email ID`,
                  }
                ]}
                value={email}
                onChange={e => setEmail(e.target.value)}
              >
                <Input placeholder="Email ID" />
              </Form.Item>
            </div>
          </Form.Item>
          <div>
            <label className="formLabel" htmlFor="languageCategory">Select English Version</label>
            <Form.Item
              name='languageCategory'
            >
              <Radio.Group style={{ width: '100%' }} className="categoryGroup" id="category">
                <Row>
                  {
                    categoryData.categories && categoryData.categories.map(item =>
                      <Col xs={24} sm={12} md={12} lg={12} xl={12} className="categoryItem" key={item.value}>
                        <Radio value={item.value}>{item.label}</Radio>
                      </Col>
                    )
                  }
                </Row>
              </Radio.Group>
            </Form.Item>
          </div>
          <div>
            <label className="formLabel" htmlFor="categoryFile">Select your file to upload</label>
            <Form.Item
              name='categoryFile'
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload name="category" listType="picture" id="categoryFile" onChange={uploadChange} onRemove={removeUploadedFile} customRequest={customReqChange} transformFile={transformFile} >
                {
                  showUpload &&
                  <Button className="uploadBtn">
                    <UploadOutlined /> Click to upload
                  </Button>
                }
              </Upload>
            </Form.Item>
          </div>
          <div>
            <label className="formLabel" htmlFor="wordCount">Word Count</label>
            <div id="word_counter_cont">
              <input type="text" value={wordcount} id="wordCount" />
              <p>Total Price :  {currencyPrize}</p>
            </div>
          </div>
          <div><label className="formLabel" htmlFor="wordCount" id="description_label">Description</label>
            <Form.Item
              name="requirement"
            >
              <TextArea rows={4} placeholder="Describe your requirement briefly." />
            </Form.Item>
          </div>
          {(!name || name.length < 3 || (!/\S+@\S+\.\S+/.test(email))) ? (
            <Form.Item className="submitBtn">
              <Button type="primary" onClick={signnn} htmlType="submit">
                Submit Document & Pay
              </Button>
            </Form.Item>
          ) : (
            <Form.Item className="submitBtn">
              <Button type="primary" htmlType="submit" disabled={disabled}>
                Submit Document & Pay
              </Button>
            </Form.Item>
          )}
        </Form>
      </QuoteFormSection>
      <Modal
        centered
        visible={success}
        width={1000}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={handelCancel}
      >
        <Quotepop id="Quotepop">
          <div id="pop_conteiner">
            <p>Your order has been successfully placed.</p>
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <p id="Quotepop_t1">Expected Delivery Date</p>
            <p id="Quotepop_t2">{dayName}, {monthName} {dayNumber}, {year}</p>
            <p id="Quotepop_t3">Thank you for submitting your document. Please proceed to make payment. You will receive a confirmation after payment is done.</p>
          </div>
          <Pay />
          <Link to="/"><Button>Back to Home</Button></Link>
        </Quotepop>
      </Modal>
    </>
  )
}

export default GetQuote
