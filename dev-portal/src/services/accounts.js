import { apiGatewayClientWithCredentials as getApiGatewayClient } from 'services/api'

const getAccountsWithFilter = async filter => {
  const apiGatewayClient = await getApiGatewayClient()
  const response = await apiGatewayClient.get(
    '/accounts',
    undefined,
    undefined,
    { queryParams: { filter } },
  )
  return response.data.accounts
}

const url = ([first, ...rest], ...parts) =>
  first + parts.map((p, i) => encodeURIComponent(p) + rest[i]).join('')

const fetch = (method, target, params = {}) =>
  getApiGatewayClient()
    .then(apiGatewayClient => apiGatewayClient[method](target, {}, params, {}))
    .then(response => response.data)

export const fetchRegisteredAccounts = () => getAccountsWithFilter('registered')
export const fetchAdminAccounts = () => getAccountsWithFilter('admin')
export const fetchPendingRequestAccounts = () => getAccountsWithFilter('pendingRequest')
export const fetchPendingInviteAccounts = () => getAccountsWithFilter('pendingInvite')

export const deleteAccountByUserId = userId => fetch('delete', url`/accounts/${userId}`)
// TODO: verify if this is even correct - I suspect it should've posted to
// `/accounts/:userId/denyRequest` instead.
export const deleteInviteByUserId = userId => fetch('delete', url`/accounts/${userId}`)
export const createInviteByEmail = email => fetch('post', '/accounts', { targetEmailAddress: email })
export const resendInviteByEmail = email => fetch('put', '/accounts/resendInvite', { targetEmailAddress: email })
export const promoteAccountByUserId = userId => fetch('put', url`/accounts/${userId}/promoteToAdmin`)
export const approveAccountRequestByUserId = userId => fetch('put', url`/accounts/${userId}/approveRequest`)
export const denyAccountRequestByUserId = userId => fetch('put', url`/accounts/${userId}/denyRequest`)
