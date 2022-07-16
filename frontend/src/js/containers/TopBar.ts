import { connect } from 'react-redux';

import TopBarWidget from '../components/TopBar';
import {loadCurrencyList} from "../actions/CurrencyActions";
import {loadSettingList} from "../actions/SettingActions";
import {loadTagList} from "../actions/TagActions";
import {loadRatesList} from "../actions/RateActions";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {loadCurrencyList, loadSettingList, loadTagList, loadRatesList};

export type TopBarProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(TopBarWidget);
