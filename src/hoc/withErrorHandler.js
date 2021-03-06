import React, { Component, Fragment } from 'react';
import Modal from '../components/UI/Modal/Modal';
import { connect } from 'react-redux';

import * as actions from '../store/actions';

const withErrorHandler = (WrappedComponent, Axios) => {
    class Wrapper extends Component {

        state = {
            error: null
        };

        componentWillMount() {
            this.reqInterceptor = Axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });
            this.resInterceptor = Axios.interceptors.response.use(res => res, error => {
                if (error.message === 'Network Error') {
                    this.setState({ error: error });
                };
                // if (error.response && error.response.status === 401) {
                //     this.props.refreshAccessToken();
                // }
                return Promise.reject(error);
            });
        }

        componentWillUnmount() {
            Axios.interceptors.request.eject(this.reqInterceptor);
            Axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        };

        render() {
            return (
                <Fragment>
                    <Modal show={this.state.error} modalClosed={this.errorConfirmedHandler} >
                        {this.state.error ? this.state.error.message : null}
                    </Modal>
                    <WrappedComponent {...this.props} />
                </Fragment>
            );
        }
    }

    return connect(null, mapDispatchToProps)(Wrapper);
}

const mapDispatchToProps = dispatch => {
    return {
        refreshAccessToken: () => dispatch(actions.refreshAccessToken())
    }
}

export default withErrorHandler;