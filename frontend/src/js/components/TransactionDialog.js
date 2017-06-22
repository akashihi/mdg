import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {Grid, Row, Col} from 'react-flexbox-grid';
import ChipInput from 'material-ui-chip-input'
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import {GridList, GridTile} from 'material-ui/GridList';

export default class TransactionDialog extends React.Component {
    render() {

        var props = this.props;

        return (<Dialog title='Transaction editing' open={props.open}>
            <Grid fluid>
                <Row>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <DatePicker hintText='Transaction date' container='inline' mode='landscape' />
                        </Col>
                    <Col xs={12} sm={12} md={6} lg={6}>
                        <TimePicker format='24hr' hintText='Transaction time'/>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <ChipInput
                            value={['huy','pizda']}
                            dataSource={['dzhigurda', 'krokodil']}
                            hintText='Tags'
                        />
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={12}>
                        <TextField hintText='Comment on transaction' fullWidth={true} multiLine={true} rows={4}/>
                    </Col>
                </Row>
            </Grid>
            <Divider/>
            <GridList cellHeight={60} cols={1}>
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                100500
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                Income (EUR)
                            </Col>
                        </Row>
                    </Grid>
                </GridTile>
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                100500
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6}>
                                Income (EUR)
                            </Col>
                        </Row>
                    </Grid>
                </GridTile>
                <GridTile>
                    <Grid fluid>
                        <Row>
                            <Col xs={1} xsOffset={5} sm={1} smOffset={5} md={1} mdOffset={5} lg={1} lgOffset={5}>
                                <IconButton><FontIcon className='material-icons'>playlist_add</FontIcon></IconButton>
                            </Col>
                        </Row>
                    </Grid>
                </GridTile>
            </GridList>
            <FlatButton label='Save' primary={true} disabled={!props.valid}/>
            <FlatButton label='Cancel' secondary={true}/>
        </Dialog>)
    }
}
