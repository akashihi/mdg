name := """mdg"""
organization := "org.akashihi"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.8"

libraryDependencies += filters
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "1.5.1" % Test
libraryDependencies += "com.typesafe.play" %% "play-slick" % "2.0.2"
libraryDependencies += "org.postgresql" % "postgresql" % "9.4.1212.jre7"
libraryDependencies += "com.ticketfly" %% "play-liquibase" % "1.4"

// Static analysis
enablePlugins(CopyPasteDetector)
compile in Compile <<= (compile in Compile) dependsOn cpd
lazy val testScalastyle = taskKey[Unit]("testScalastyle")
testScalastyle := org.scalastyle.sbt.ScalastylePlugin.scalastyle.in(Test).toTask("").value
compile in Compile <<= (compile in Compile) dependsOn testScalastyle


// Adds additional packages into Twirl
//TwirlKeys.templateImports += "org.akashihi.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "org.akashihi.binders._"
