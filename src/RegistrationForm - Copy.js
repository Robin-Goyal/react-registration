import React from 'react';
import { Form } from 'react-advanced-form';
import axios from 'axios'
import { Input, Button, Select, Label } from 'react-advanced-form-addons';
import country from './country';

export default class RegistrationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            country: 'AU',
            countryCode: 61,
            phone: ''
        };
        this.onChangeHandler = this.onChangeHandler.bind(this);
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
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                axios.get('http://api.geonames.org/countryCodeJSON?formatted=true&lat='+ position.coords.latitude +'&lng='+ position.coords.longitude +'&username=robinjspanther&style=full').then((response) => {
                    let data = response.data;
                    country.map(item => {
                        if (item.code === data.countryCode) {
                            this.setState({
                                country: data.countryCode,
                                countryCode: item.countryCode
                            }); 
                            return true;
                        }
                        return true;
                    });
                }).catch((error) => {
                    console.log(error);
                });
            });
        }
    }

    registerUser = ({ serialized, fields, form }) => {
        if (serialized) {
            serialized.phone = this.state.phone;
            serialized.phoneCode = this.state.countryCode;
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
        <Form ref={form => this.formRef = form} action={ this.registerUser }>
            <h3>Registration Form</h3>
            <Input
                name="firstName"
                label="First name"
                required
            />
            <Input
                name="lastName"
                label="Last name"
                required
            />
            <Input
                name="userEmail"
                type="email"
                label="Your personal email"
                required
            />
            <div className="phone-block">
                <Label>Phone</Label>
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
            <Input
                name="town"
                label="Town/City"
            />
            <div className="country-block">
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
            <Input
                name="profileurl"
                label="Linkedin profile URL"
                required
            />
            <Input
                name="resume"
                type="file"
                label="Resume"
                required
            />
            <Input
                name="skills"
                label="Specify your key skills"
            />
            <Input
                name="custommessage"
                label="Message"
            />
            <Button primary>Send</Button>
        </Form>
        );
    }
}
