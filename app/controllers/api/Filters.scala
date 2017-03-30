package controllers.api

import javax.inject.Inject
import play.api.http.DefaultHttpFilters

/**
  * Dictionary of filters, that should be applied to the actions.
  */
class Filters @Inject() (ct: CustomContentTypeAddingFilter) extends DefaultHttpFilters(ct)
