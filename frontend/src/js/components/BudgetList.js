import React, {Component, Fragment} from 'react';
import moment from 'moment';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DatePicker from 'react-date-picker'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import Button from '@material-ui/core/Button';
import ClipLoader from 'react-spinners/ClipLoader';

class FormikDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange = value => {
        this.props.form.setFieldValue(this.props.field.name, value, true);
    };

    handleBlur = () => {
        this.props.form.setFieldTouched(this.props.field.name, true);
    };

    render() {
        return (
            <DatePicker
                autoComplete='off'
                id={this.props.id}
                value={
                    typeof this.props.field.value === 'string'
                        ? moment(this.props.field.value)
                        : this.props.field.value
                }
                onBlur={this.handleBlur}
                dateFormat='DD-MM-YYYY'
                onChange={this.handleChange}
                showYearDropdown
                dateFormatCalendar='MMMM'
                scrollableYearDropdown
                disabled={this.props.field.disabled}
                yearDropdownItemNumber={15}
            />
        );
    }
}

export default class BudgetList extends Component {
    onCreateBudget(values, form) {
        this.props.actions.budgetCreate(values.begin, values.end);
        form.resetForm();
    }

    onDeleteBudget() {
        this.props.actions.deleteBudget(this.props.budget.id)
    }


    newBudgetValidate() {
        const props = this.props;
        return (values) => {
            let errors = {};
            if (!values.begin || !values.end) {
                return errors
            }

            const b = new Date(values.begin);
            const e = new Date(values.end);

            if (b > e) {
                errors.end = 'Budget should begin before it\'s completion'
            } else {
                const oneDay = 24 * 60 * 60 * 1000;
                const days = Math.round((e.getTime() - b.getTime()) / oneDay);
                if (days < 1) {
                    errors.end = 'Budget should be at least one full day long'
                }
            }


            props.budgets.forEach(budget => {
                const tb = new Date(budget.get('term_beginning'));
                const te = new Date(budget.get('term_end'));
                if (tb <= e && te >= b) {
                    errors.begin = 'Budget is overlapping with existing budgets'
                }
            });
            return errors
        }
    }

    createForm() {
        const props = this.props;

        const initialValues = {
            begin: props.begin,
            end: props.end
        };

        return <Formik initialValues={initialValues} validate={::this.newBudgetValidate()}
                       onSubmit={::this.onCreateBudget}>
            {({submitForm, isSubmitting, values}) => (
                <Form>
                    <Field type='text' name='begin' label='First budget day' value={values.begin}
                           component={FormikDatePicker}/>
                    <ErrorMessage name='begin' component='div'/>
                    <Field type='text' name='end' label='Last budget day' value={values.end}
                           component={FormikDatePicker}/>
                    <ErrorMessage name='end' component='div'/>
                    <Button color='primary' disabled={isSubmitting} onClick={submitForm}>Create new budget</Button>
                </Form>
            )}
        </Formik>;

    }

    selector() {
        const props = this.props;

        if (props.waiting) {
            return <ClipLoader sizeUnit={'px'} size={25} loading={true}/>
        }
        if (props.error) {
            return <h1>Unable to load budget list</h1>
        }
        const budgetList = props.budgets.map((v, k) => <MenuItem key={k}
                                                                 value={k}>{v.get('term_beginning') + ' - ' + v.get('term_end')}</MenuItem>).valueSeq().toJS();

        return (
            <Fragment>
                <InputLabel htmlFor={'budget-selector'}>Select budget:</InputLabel>
                <Select value={props.budget.id} onChange={(ev) => props.actions.selectBudget(ev.target.value)}
                        inputProps={{id: 'budget-selector'}}>
                    {budgetList}
                </Select>
                <Button color='primary' onClick={::this.onDeleteBudget}>Delete selected budget</Button>
            </Fragment>
        )
    }

    render() {
        return (
            <Fragment>
                {::this.selector()}
                {::this.createForm()}
            </Fragment>
        )
    }
}
