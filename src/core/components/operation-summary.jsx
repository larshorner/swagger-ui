import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Iterable, List } from "immutable"
import ImPropTypes from "react-immutable-proptypes"
import toString from "lodash/toString"


export default class OperationSummary extends PureComponent {

  static propTypes = {
    specPath: ImPropTypes.list.isRequired,
    operationProps: PropTypes.instanceOf(Iterable).isRequired,
    toggleShown: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,
    getConfigs: PropTypes.func.isRequired,
    authActions: PropTypes.object,
    authSelectors: PropTypes.object,
  }

  static defaultProps = {
    operationProps: null,
    specPath: List(),
    summary: "",
    badges: List()
  }

  render() {

    let {
      toggleShown,
      getComponent,
      authActions,
      authSelectors,
      operationProps,
      specPath,
    } = this.props

    let {
      summary,
      isAuthorized,
      method,
      op,
      showSummary,
      operationId,
      originalOperationId,
      displayOperationId,
      badges
    } = operationProps.toJS()

    let {
      summary: resolvedSummary,
    } = op

    let security = operationProps.get("security")

    const AuthorizeOperationBtn = getComponent("authorizeOperationBtn")
    const OperationSummaryMethod = getComponent("OperationSummaryMethod")
    const OperationSummaryPath = getComponent("OperationSummaryPath")
    const JumpToPath = getComponent("JumpToPath", true)

      let table = []
      let badgeCount = badges.length
      for(let i = 0; i < badgeCount; i++){
        table.push(<div className={`opblock-badge opblock-badge-${badges[i].color}`}>
            {toString(badges[i].text)}
          </div>
        )
      }

    return (

      <div className={`opblock-summary opblock-summary-${method}`} onClick={toggleShown} >
        <OperationSummaryMethod method={method} />
        <OperationSummaryPath getComponent={getComponent} operationProps={operationProps} specPath={specPath} />

        {table}

        {!showSummary ? null :
          <div className="opblock-summary-description">
            {toString(resolvedSummary || summary)}
          </div>
        }

        {displayOperationId && (originalOperationId || operationId) ? <span className="opblock-summary-operation-id">{originalOperationId || operationId}</span> : null}

        {
          (!security || !security.count()) ? null :
            <AuthorizeOperationBtn
              isAuthorized={isAuthorized}
              onClick={() => {
                const applicableDefinitions = authSelectors.definitionsForRequirements(security)
                authActions.showDefinitions(applicableDefinitions)
              }}
            />
        }
        <JumpToPath path={specPath} />{/* TODO: use wrapComponents here, swagger-ui doesn't care about jumpToPath */}
      </div>
    )

  }
}
