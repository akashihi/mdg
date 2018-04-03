import { connect } from 'react-redux'

import TopBarWidget from '../components/TopBar'

const mapStateToProps = (state) => {
    return {
        path: state.router.location.pathname
    }
};

export default connect(mapStateToProps)(TopBarWidget)
