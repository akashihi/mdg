name := """mdg"""
organization := "org.akashihi"

version := "0.0.1"
packageName in Universal := "mdg"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.12.6"

libraryDependencies += guice
libraryDependencies += filters
libraryDependencies += "com.typesafe.play" %% "play-slick" % "3.0.3"
libraryDependencies += "org.postgresql" % "postgresql" % "42.2.2"
libraryDependencies += "com.ticketfly" %% "play-liquibase" % "1.4"
libraryDependencies += "com.github.cb372" %% "scalacache-guava" % "0.24.1"

val scalazVersion = "7.2.22"

libraryDependencies ++= Seq(
  "org.scalaz" %% "scalaz-core" % scalazVersion,
  "org.scalaz" %% "scalaz-effect" % scalazVersion
)

// Static analysis
compile in Compile := (compile in Compile).dependsOn(cpd).value
lazy val compileScalastyle = taskKey[Unit]("compileScalastyle")
compileScalastyle := scalastyle.in(Compile).toTask("").value
compile in Compile := (compile in Compile).dependsOn(compileScalastyle).value
