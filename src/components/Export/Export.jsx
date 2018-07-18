/**
 * This component is used to export transaction history(My Account screen)
 * and resolved bets(My Wager screen -> Resolved Bets tab) data to an excel file and download it.
 * It is used in the TransactionHistory and ResolvedBets components.
 * It uses 'antd' cards to display the various statuses of export i.e Loading,No data and Ready.
 * It uses the following 2 utility files:
 *    ExportUtils: to format the data in tabular form so that it can be copied to excel file
 *    FileSaverUtils: to name the excel file and download it on the user's computer
 */
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

  /**
   * This function is called when user clicks on the 'Download' button of the ready status card.
   * It copies the data into an excel file (xlsx).
   * The excel file is named in the format : <screen_name>_<YYYY-MM-DD_HH-mm-ss>.xlsx
   * The file is then downloaded into the user's computer
   */
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
        prefix = I18n.t('mybets.screenName')
        break;
      }
      default: break;
    }

    FileSaverUtils.saveAs(blob, prefix + moment().format('YYYY-MM-DD_HH-mm-ss') + '.xlsx');

    // Reset export
    this.props.handleResetExport();
  }

  /** This function is used to cancel the export process */
  handleCancelClick(event) {
    event.preventDefault();
    // Reset export
    this.props.handleResetExport();
  }

  /**
   * This 'antd' card will be rendered when the data fetching is in the 'loading' phase.
   * It contains the 'Cancel' button for user to cancel the export during this phase.
   */
  renderExportLoading() {
    return (
      <Card className='export-card' title={ I18n.t('application.exportLoadingHeader') }>
        <p>{ I18n.t('application.exportDataFetchMsg') }</p>
        <div className='loader-icon-main'>
          {/* TODO: Loader icon change as per mockup */}
          <Icon type='loading'></Icon>
        </div>
        <div className='card-footer'>
          <button className='btn btn-cancel'
            onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
          </button>
        </div>
      </Card>
    )
  }

  /**
   * This function is used to render data when it is in the 'ready' phase
   * It will display the appropriate card based on the availability of the data.
   */
  renderExportReady() {
    const { exportData } = this.props;
    if (exportData.size === 0) {
      return (
        <Card className='export-card export-empty-data' title={ I18n.t('application.exportNoDataHeader') }>
          <p>{ I18n.t('application.exportNoDataMsg') }</p>
          <div className='card-footer'>
            <button className='btn btn-cancel'
              onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
            </button>
          </div>
        </Card>
      )
    } else {
      return (
        <Card className='export-card' title={ I18n.t('application.exportDownloadHeader') }>
          <p>{ I18n.t('application.exportDataReadyMsg1') }<br/>
          { I18n.t('application.exportDataReadyMsg2') }</p>
          <div className='card-footer'>
            <button className='btn btn-cancel'
                    onClick={ this.handleCancelClick }>{ I18n.t('mybets.cancel') }
            </button>
            <button className='btn btn-primary download'
              onClick={ this.handleDownloadClick }>{ I18n.t('application.download') }
            </button>
          </div>
        </Card>
      )
    }
  }

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
