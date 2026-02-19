from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['_id', 'name', 'email', 'team_id', 'created_at']

    def get__id(self, obj):
        return str(obj._id)


class TeamSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = ['_id', 'name', 'description', 'created_at']

    def get__id(self, obj):
        return str(obj._id)


class ActivitySerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Activity
        fields = ['_id', 'user_id', 'activity_type', 'duration', 'distance', 'calories', 'date', 'notes']

    def get__id(self, obj):
        return str(obj._id)


class LeaderboardSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Leaderboard
        fields = ['_id', 'user_id', 'team_id', 'total_calories', 'total_duration', 'total_activities', 'rank']

    def get__id(self, obj):
        return str(obj._id)


class WorkoutSerializer(serializers.ModelSerializer):
    _id = serializers.SerializerMethodField()

    class Meta:
        model = Workout
        fields = ['_id', 'name', 'description', 'category', 'difficulty', 'duration', 'calories_estimate', 'exercises']

    def get__id(self, obj):
        return str(obj._id)
