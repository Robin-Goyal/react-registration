import React from 'react';
import { Form } from 'react-advanced-form';
import axios from 'axios';
import { css } from "@emotion/core";
import PacmanLoader from "react-spinners/PacmanLoader";
import ChipInput from 'material-ui-chip-input';
import { Input, Button, Select, Label } from 'react-advanced-form-addons';
import country from './country';

const override = css`
  position: absolute;
  margin: 0 auto;
  border-color: #00836c;
  left: 42%;
  top: 30%;
  z-index: 1;
`;

export default class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            country: 'AU',
            countryCode: 61,
            skills: [],
            phone: ''
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.skillChange = this.skillChange.bind(this);
    }

    onChangeHandler(event) {
        const target = event.target;
        if (target) {
            const value = target.value;
            const name = target.name;
            if (name === 'phone') {
                this.validatePhone(value);
            } else {
                this.setState({
                    [name]: value
                }); 
            }
        } else if(event.nextValue) {
            this.setState({
                country: event.nextValue
            }); 
        }
    }

    skillChange(chips) {
        this.setState({
            skills: chips
        }); 
    }


    validatePhone(val) {
        const plusCountryCode = '+' + this.state.countryCode;
        const plusBracketCountryCode = '(+' + this.state.countryCode;
        const value = val ? val.trimStart() : '';
        let newVal = val;
        if (value.startsWith('+') && value.includes(plusCountryCode) && value !== plusCountryCode) {
            newVal = newVal.replace(plusCountryCode , '');
            newVal = newVal.replace(plusCountryCode + '-' , '');
        } else if (value.startsWith('(') && value.includes(plusBracketCountryCode) && value !== plusBracketCountryCode) {
            newVal = newVal.replace(plusBracketCountryCode + ')' , '');
            newVal = newVal.replace(plusBracketCountryCode , '');
        } else if (value.startsWith('0') && value.length > 2) {
            newVal = newVal.replace(/^0+/, '');
        }

        if (newVal.length > 15) {
            newVal = newVal.slice(0, 15);
        }

        this.setState({
            phone: newVal
        }); 
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        axios.get('https://ipapi.co/json/').then((response) => {
            this.setState({
                loading: false
            }); 
            let data = response.data;
            country.map(item => {
                if (item.code === data.country_code) {
                    this.setState({
                        country: data.country_code,
                        countryCode: item.countryCode
                    }); 
                    return true;
                }
                return true;
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                loading: false
            });
        });
    }

    registerUser = ({ serialized, fields, form }) => {
        if (serialized) {
            serialized.phone = this.state.phone;
            serialized.phoneCode = this.state.countryCode;
            serialized.skills = this.state.skills;
            const data = JSON.stringify(serialized, null, 2);
            alert(data);
        }
        return new Promise(resolve => resolve());
    }

    restrict = (eventInstance) => {
        const target = eventInstance.target;
        if (target && target.value.length > 14) {
            if (eventInstance.preventDefault)
                eventInstance.preventDefault();
            eventInstance.returnValue = false;
            return false;
        }
        const key = eventInstance.keyCode || eventInstance.which;
        if (((47 < key) && (key < 58)) || key === 8 || key === 43 || key === 45 || key === 40 || key === 41 || key === 32) {
            return true;
        } else {
            if (eventInstance.preventDefault)
                eventInstance.preventDefault();
            eventInstance.returnValue = false;
            return false;
        }
    }
    
    render() {
        return (
            <div>
                <PacmanLoader
                    css={override}
                    size={25}
                    color={"#00836c"}
                    loading={this.state.loading}
                />
                <div className="form-container">
                <Form className={this.state.loading ? 'loading-data': ''} ref={form => this.formRef = form} action={ this.registerUser }>
                    <h3>Registration Form</h3>
                    <div className="input-row">
                        <div className="input-field">
                            <Input
                                name="firstName"
                                label="First name"
                                required
                            />
                        </div>
                        <div className="input-field">
                            <Input
                                name="lastName"
                                label="Last name"
                                required
                            />
                        </div>
                        <div className="input-field">
                            <Input
                                name="userEmail"
                                type="email"
                                label="Your personal email"
                                required
                            />
                        </div>
                    
                        <div className="input-field phone-block">
                            <Label>Phone</Label>
                            <div className="phoneCode-row">
                                <span className="phoneCode">
                                    <select name="countryCode" value={this.state.countryCode} onChange={this.onChangeHandler}>
                                        {
                                            country.map(item => (
                                                <option key={item.code} value={item.countryCode}>{'+' + item.countryCode}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </span>
                                <input type="text" name="phone" value={this.state.phone} onKeyPress={(e) => this.restrict(e)} onChange={this.onChangeHandler} />
                            </div>
                        </div>
                        <div className="input-field">
                            <Input
                                name="town"
                                label="Town/City"
                            />
                        </div>
                    
                        <div className="input-field country-block">
                            <Label required>Country</Label>
                            <Select
                                name="country"
                                placeholder="Country"
                                value={this.state.country}
                                onChange={this.onChangeHandler}
                                required>
                                {
                                    country.map(item => (
                                        <option key={item.code} value={item.code}>{item.name}</option>
                                    ))
                                }
                            </Select>
                        </div>
                        <div className="input-field">
                            <Input
                                name="profileurl"
                                label="Linkedin profile URL"
                                required
                            />
                        </div>
                        <div className="input-field">
                            <Input
                                name="resume"
                                type="file"
                                label="Resume"
                                required
                            />
                        </div>
                        <div className="input-field full-width">
                            <Label>Skills</Label>
                            <ChipInput
                                onChange={(chips) => this.skillChange(chips)}
                                label="Specify your key skills"
                                variant="outlined"
                                style={{ width: 265 }}
                                newChipKeys={['Enter', 'Tab']}
                                blurBehavior="add"
                            />
                        </div>
                        <div className="input-field message full-width">
                            <Input
                                name="custommessage"
                                label="Message"
                            />
                        </div>
                    </div>
                    <Button primary>Send</Button>
                </Form>
                </div>
            </div>
        );
    }
}
