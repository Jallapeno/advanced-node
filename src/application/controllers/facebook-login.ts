import { type FacebookAuthentication } from '@/domain/features'
import { badRequest, unauthorized, type HttpResponse, serverError, ok } from '@/application/helpers'
import { AccessToken } from '@/domain/models'
import { RequiredStringValidator } from '../validation'

type HttpRequest = {
  token: string
}

type Model = Error | {
  accessToken: string
}
export class FacebookLoginController {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const error = this.validade(httpRequest)
      if (error !== undefined) {
        return badRequest(error)
      }
      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })
      if (accessToken instanceof AccessToken) {
        return ok({
          accessToken: accessToken.value
        })
      } else {
        return unauthorized()
      }
    } catch (error) {
      return serverError(error)
    }
  }

  private validade (httpRequest: HttpRequest): Error | undefined {
    const validator = new RequiredStringValidator(httpRequest.token, 'token')
    return validator.validate()
  }
}
