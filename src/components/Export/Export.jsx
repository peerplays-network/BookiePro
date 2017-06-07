import React, { PureComponent } from 'react';
import { Card,Icon } from 'antd';
import { I18n } from 'react-redux-i18n';
import { ExportUtils, FileSaverUtils } from '../../utility';
import moment from 'moment';
import { LoadingStatus, ExportTypes } from '../../constants';
import PropTypes from 'prop-types';
import Immutable from 'immutable';

class Export extends PureComponent {

  constructor(props){
    super(props);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleDownloadClick = this.handleDownloadClick.bind(this);
    this.renderExportLoading = this.renderExportLoading.bind(this);
    this.renderExportReady = this.renderExportReady.bind(this);
  }

  //Copy the contents from the store to an excel file and download it
  handleDownloadClick(){
    const exportData = this.props.exportData.toJS();
    let content = ExportUtils.formatDataForExport(exportData, null, { toBytes: true });
    let blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=charset=utf-8' });

    let prefix;
    switch (this.props.type) {
      case ExportTypes.TRANSACTION_HISTORY: {
        prefix = I18n.t('myAccount.screenName')
        break;
      }
      case ExportTypes.RESOLVED_BETS: {
        prefix = I18n.t('myBets.screenName')
        break;
      }
      default: break;
    }

    FileSaverUtils.saveAs(blob, prefix + moment().format('YYYY-MM-DD_HH-mm-ss') + '.xlsx');

    // Reset export
    this.props.handleResetExport();
  }

  handleCancelClick(event) {
    event.preventDefault();
    // Reset export
    this.props.handleResetExport();
  }

  renderExportLoading() {
    return (
      <Card className='export-card' title={ I18n.t('application.exportLoadingHeader') }>
        <p>{ I18n.t('application.exportDataFetchMsg') }</p>
        <div className='loader-icon-main'>
          {/* TODO: Loader icon change as per mockup */}
          <Icon type='loading'></Icon>
        </div>
        <div className='card-footer'>
          <button className='btn cancel-btn'
            onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
          </button>
        </div>
      </Card>
    )
  }

  renderExportReady() {
    const { exportData } = this.props;
    if (exportData.size === 0) {
      return (
        <Card className='export-card' title={ I18n.t('application.exportNoDataHeader') }>
          <p>{ I18n.t('application.exportNoDataMsg') }</p>
          <div className='card-footer'>
            <button className='btn cancel-btn'
              onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
            </button>
          </div>
        </Card>
      )
    } else {
      return (
        <Card className='export-card' title={ I18n.t('application.exportDownloadHeader') }>
          <p>{ I18n.t('application.exportDataReadyMsg') }</p>
          <div className='card-footer'>
            <button className='btn btn-primary download'
              onClick={ this.handleDownloadClick }>{ I18n.t('application.download') }
            </button>
            <button className='btn cancel-btn'
              onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
            </button>
          </div>
        </Card>
      )
    }
  }


  /*
    Display 'loading' card when data is being fetched to exportData
    Display 'download' card when the data is ready to be downloaded
    Display 'no results' card when there is no data
  */
  render(){
    const { exportLoadingStatus, type } = this.props;
    if (exportLoadingStatus === LoadingStatus.LOADING ||  exportLoadingStatus === LoadingStatus.DONE) {
      // Show modal when the export is loading or ready
      let content;
      if (exportLoadingStatus === LoadingStatus.LOADING ) {
        content = this.renderExportLoading();
      } else if (exportLoadingStatus === LoadingStatus.DONE ) {
        content = this.renderExportReady();
      }
      // Wrap the content with overlay
      return (
        <div className={ type === ExportTypes.RESOLVED_BETS ?
            'export-overlay-top export-overlay' : 'export-overlay' }>
          { content }
        </div>
      )
    } else {
      return null;
    }
  }
}

Export.propTypes = {
  exportData: PropTypes.instanceOf(Immutable.List),
  handleResetExport: PropTypes.func,
  type: PropTypes.string.isRequired,
  exportLoadingStatus: PropTypes.string
}

Export.defaultProps = {
  exportData: Immutable.List(),
  handleResetExport: () => {},
  exportLoadingStatus: LoadingStatus.DEFAULT
}

export default Export
