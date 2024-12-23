import 'package:flutter/material.dart';
import 'dart:html' as html;

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Flutter app register",
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  @override
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  String tgId = '';
  String username = '';
  String firstName = '';
  String lastName = '';
  String profilePhotoUrl = '';

  @override
  void initState() {
    super.initState();
    _getUrlParams();
  }

  // URL parametrlarini olish
  void _getUrlParams() {
    final uri = html.window.location.href;
    final params = Uri.parse(uri).queryParameters;

    setState(() {
      tgId = params['tg_id'] ?? '';
      username = params['username'] ?? '';
      firstName = params['first_name'] ?? '';
      lastName = params['last_name'] ?? '';
      profilePhotoUrl = params['profile_photo'] ?? '';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Welcome to the Flutter Web App')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Telegram ID: $tgId'),
            Text('Username: $username'),
            Text('First Name: $firstName'),
            Text('Last Name: $lastName'),
            profilePhotoUrl.isNotEmpty
                ? Image.network(profilePhotoUrl)
                : Container(),
          ],
        ),
      ),
    );
  }
}
