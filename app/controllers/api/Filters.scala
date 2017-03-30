package controllers.api

import javax.inject.Inject
import play.api.http.DefaultHttpFilters

/**
  * Created by dchaplyg on 3/30/17.
  */
class Filters @Inject() (ct: CustomContentTypeAddingFilter) extends DefaultHttpFilters(ct)
